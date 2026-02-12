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
import { IpfsService } from 'src/ipfs/ipfs.service';
import { BlockchainService } from 'src/blockchain/blockchain.service';

@Injectable()
export class QuestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ipfsService: IpfsService,
    private readonly blockchainService: BlockchainService,
  ) {}

  async createQuest(data: CreateQuestDto) {
    const cid = await this.ipfsService.uploadJson(data.metadata);

    return await this.prisma.quest.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        xpReward: data.xpReward,
        metadataHash: `ipfs://${cid}`,
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

    const quest = await this.prisma.quest.findUnique({
      where: { id: questId },
    });

    if (!quest || !quest.isActive) {
      throw new BadRequestException('Quest not found or inactive');
    }

    const user = await this.prisma.user.upsert({
      where: { walletAddress: normalizedWallet },
      update: {},
      create: { walletAddress: normalizedWallet },
    });

    const existing = await this.prisma.questCompletion.findUnique({
      where: {
        userId_questId: {
          userId: user.id,
          questId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Quest already completed by this user');
    }

    return this.prisma.questCompletion.create({
      data: {
        userId: user.id,
        questId,
        txHash: body.txHash,
        signature: body.signature,
        status: 'PENDING',
      },
    });
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

      if (completion.status !== 'PENDING') {
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
