/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { BlockchainService } from '../blockchain/blockchain.service';
import { IpfsService } from '../ipfs/ipfs.service';
import { PrismaService } from '../prisma/prisma.service';
import { CONTRACT_ADDRESSES } from '@repo/contract-types';

@Processor('badge-mint')
export class BadgeProcessor extends WorkerHost {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly ipfsService: IpfsService,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async process(job: Job<any>) {
    const { userId, wallet, questId, questTitle, imageUrl } = job.data;

    console.log('Minting badge in background');

    try {
      const metadata = {
        name: `Quest ${questTitle}`,
        description: `Awarded for completing ${questTitle}`,
        image: imageUrl ?? '',
      };

      const cid = await this.ipfsService.uploadJson(metadata);
      const tokenURI = `ipfs://${cid}`;

      const tokenId = await this.blockchainService.mintBadgeOnChain(
        wallet as string,
        tokenURI,
      );

      await this.prismaService.badge.create({
        data: {
          userId,
          questId,
          tokenId,
          contractAddr: CONTRACT_ADDRESSES.BadgeSBT,
          name: metadata.name,
          imageUrl: metadata.image,
        },
      });

      console.log('✅ Badge minted successfully:', tokenId);
    } catch (error) {
      console.error('❌ Badge mint failed:', error);
      throw error;
    }
  }
}
