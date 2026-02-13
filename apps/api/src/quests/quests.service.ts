/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { SubmitQuestDto } from './dto/submit-quest.dto';
import { BadRequestException } from '@nestjs/common';
import { normalizeWallet } from '../users/utils/wallet.util';
import { IpfsService } from '../ipfs/ipfs.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CONTRACT_ADDRESSES } from '@repo/contract-types';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QuestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ipfsService: IpfsService,
    private readonly blockchainService: BlockchainService,

    @InjectQueue('badge-mint')
    private badgeQueue: Queue,
  ) {}

  async createQuest(data: CreateQuestDto) {
    const cid = await this.ipfsService.uploadJson(data.metadata);
    const metadataHash = `ipfs://${cid}`;

    const endTime = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    const questTypemap = {
      TX: 0,
      SIGN: 1,
      MULTI: 2,
    };

    const questId = await this.blockchainService.createQuestOnChain(
      metadataHash,
      questTypemap[data.type],
      endTime,
    );

    return this.prisma.quest.create({
      data: {
        id: questId,
        title: data.title,
        description: data.description,
        type: data.type,
        xpReward: data.xpReward,
        metadataHash,
        isActive: true,
      },
    });
  }

  async getActiveQuests() {
    return await this.prisma.quest.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submitQuest(questId: number, body: SubmitQuestDto) {
    const normalizedWallet = normalizeWallet(body.wallet);

    // ---------------------------
    // 1️⃣ Fetch quest
    // ---------------------------
    const quest = await this.prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!quest) {
      throw new BadRequestException('Quest not found or inactive');
    }

    // ---------------------------
    // 2️⃣ On-chain validation
    // ---------------------------
    const isActiveOnChain =
      await this.blockchainService.isQuestActiveOnChain(questId);

    if (!isActiveOnChain) {
      throw new BadRequestException('Quest is not active on-chain');
    }

    const onChainMetadata =
      await this.blockchainService.getQuestMetadataOnChain(questId);

    if (onChainMetadata !== quest.metadataHash) {
      throw new BadRequestException(
        'Quest metadata mismatch with on-chain data',
      );
    }

    // ---------------------------
    // 3️⃣ Verify TX
    // ---------------------------
    if (!body.txHash) {
      throw new BadRequestException(
        'Transaction hash is required for quest submission',
      );
    }

    const metadata = await this.ipfsService.fetchJson(quest.metadataHash);

    const isValid = await this.blockchainService.verifySepoliaTransaction(
      body.txHash,
      normalizedWallet,
      metadata,
    );

    // ---------------------------
    // 4️⃣ FAST DB TRANSACTION
    // ---------------------------
    const result = await this.prisma.$transaction(async (txDB) => {
      const user = await txDB.user.upsert({
        where: { walletAddress: normalizedWallet },
        update: {},
        create: { walletAddress: normalizedWallet },
      });

      const existing = await txDB.questCompletion.findUnique({
        where: {
          userId_questId: {
            userId: user.id,
            questId,
          },
        },
      });

      if (existing) {
        throw new BadRequestException(
          'Quest completion already exists for user',
        );
      }

      const status = isValid ? 'VERIFIED' : 'REJECTED';

      await txDB.questCompletion.create({
        data: {
          userId: user.id,
          questId,
          txHash: body.txHash,
          status,
        },
      });

      if (isValid) {
        await txDB.user.update({
          where: { id: user.id },
          data: {
            totalXP: { increment: quest.xpReward },
          },
        });

        await txDB.xPLedger.create({
          data: {
            userId: user.id,
            questId,
            xpAdded: quest.xpReward,
            reason: `Completed quest: ${quest.title}`,
          },
        });
      }
      return {
        status,
        userId: user.id,
      };
    });

    // ---------------------------
    // 5️⃣ NFT BADGE (OUTSIDE TX)
    // ---------------------------
    if (isValid) {
      try {
        const badgeMetadata = {
          name: `Quest ${quest.title}`,
          description: `Awarded for completing ${quest.title}`,
          image: quest.imageUrl ?? '',
        };

        const badgeCid = await this.ipfsService.uploadJson(badgeMetadata);
        const tokenURI = `ipfs://${badgeCid}`;

        const tokenId = await this.blockchainService.mintBadgeOnChain(
          normalizedWallet,
          tokenURI,
        );

        await this.prisma.badge.create({
          data: {
            userId: result.userId,
            questId,
            tokenId,
            contractAddr: CONTRACT_ADDRESSES.BadgeSBT,
            name: badgeMetadata.name,
            imageUrl: badgeMetadata.image,
          },
        });
      } catch (error) {
        console.error('⚠️ Badge mint failed:', error);
      }
    }

    return {
      status: result.status,
      message: isValid
        ? 'Quest verified and XP awarded'
        : 'Quest verification failed',
    };
  }

  async verifyQuest(completionId: string) {
    return await this.prisma.$transaction(async (tx) => {
      const completion = await tx.questCompletion.findUnique({
        where: { id: completionId },
        include: { quest: true, user: true },
      });
      if (!completion) {
        throw new BadRequestException('Quest completion not found');
      }

      if (completion.status !== 'VERIFIED') {
        throw new BadRequestException('Quest completion already processed');
      }

      await tx.questCompletion.update({
        where: { id: completionId },
        data: { status: 'VERIFIED' },
      });

      await tx.user.update({
        where: { id: completion.userId },
        data: {
          totalXP: { increment: completion.quest.xpReward },
        },
      });

      await tx.xPLedger.create({
        data: {
          userId: completion.userId,
          questId: completion.questId,
          xpAdded: completion.quest.xpReward,
          reason: `Completed quest: ${completion.quest.title}`,
        },
      });

      return { message: 'Quest verified and XP awarded' };
    });
  }
}
