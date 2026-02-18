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

    @InjectQueue('quest-create')
    private questCreateQueue: Queue,
  ) {}

  async createQuest(data: CreateQuestDto) {
    const job = await this.questCreateQueue.add(
      'create-quest',
      { data },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
      },
    );

    return {
      message: 'Quest creation started',
      jobId: job.id,
    };
  }

  async getActiveQuests(wallet?: string) {
    const quests = await this.prisma.quest.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!wallet) {
      return quests.map((q) => ({
        ...q,
        completed: false,
      }));
    }

    const normalized = normalizeWallet(wallet);

    const user = await this.prisma.user.findUnique({
      where: { walletAddress: normalized },
      include: {
        completions: {
          select: { questId: true },
        },
      },
    });

    if (!user) {
      return quests.map((q) => ({
        ...q,
        completed: false,
      }));
    }

    const completedIds = new Set(user.completions.map((c) => c.questId));

    return quests.map((q) => ({
      ...q,
      completed: completedIds.has(q.id),
    }));
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
    const metadata = await this.ipfsService.fetchJson(quest.metadataHash);

    let isValid = false;

    switch (quest.type) {
      case 'TX': {
        if (!body.txHash) {
          throw new BadRequestException('TX quest requires transaction');
        }

        isValid = await this.blockchainService.verifySepoliaTransaction(
          body.txHash,
          normalizedWallet,
          metadata,
        );
        break;
      }

      case 'SIGN': {
        if (!body.signature) {
          throw new BadRequestException('SIGN quest requires signature');
        }

        if (!metadata.message) {
          throw new BadRequestException('Invalid SIGN quest metadata');
        }

        isValid = await this.blockchainService.verifySignature(
          normalizedWallet,
          body.signature,
          metadata.message,
        );
        break;
      }

      default:
        throw new BadRequestException('Unsupported quest type');
    }

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
          signature: body.signature,
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
        await this.badgeQueue.add(
          'mint-badge',
          {
            userId: result.userId,
            wallet: normalizedWallet,
            questId,
            questTitle: quest.title,
            imageUrl: quest.imageUrl,
          },
          {
            attempts: 5,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
          },
        );

        console.log('📦 Badge mint job queued');
      } catch (error) {
        console.error('⚠️ Failed to queue badge job:', error);
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
