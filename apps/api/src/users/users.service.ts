/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { normalizeWallet } from './utils/wallet.util';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateUser(wallet: string) {
    const normalized = normalizeWallet(wallet);

    return await this.prisma.user.upsert({
      where: { walletAddress: normalized },
      update: {},
      create: { walletAddress: normalized },
    });
  }

  async getProfile(wallet: string) {
    const normalized = normalizeWallet(wallet);

    const user = await this.prisma.user.upsert({
      where: { walletAddress: normalized },
      update: {},
      create: { walletAddress: normalized },
      include: {
        completions: {
          where: { status: 'VERIFIED' },
        },
        badges: true,
      },
    });
    const higherXpCount = await this.prisma.user.count({
      where: {
        totalXP: {
          gt: user.totalXP,
        },
      },
    });

    const rank = higherXpCount + 1;

    return {
      wallet: user.walletAddress,
      username: user.username,
      totalXP: user.totalXP,
      completedQuests: user.completions.length,
      rank: rank,
      badges: user.badges,
    };
  }

  async getLeaderBoard(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        orderBy: { totalXP: 'desc' },
        skip,
        take: limit,
        select: {
          walletAddress: true,
          username: true,
          totalXP: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    const data = users.map((user, total) => ({
      rank: skip + total + 1,
      wallet: user.walletAddress,
      username: user.username,
      totalXP: user.totalXP,
    }));

    return {
      page,
      limit,
      totalUsers,
      data,
    };
  }
}
