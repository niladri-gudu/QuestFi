import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { BadgeProcessor } from './badge.processor';
import { BlockchainService } from '../blockchain/blockchain.service';
import { IpfsService } from '../ipfs/ipfs.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'badge-mint',
    }),
  ],
  providers: [BadgeProcessor, BlockchainService, IpfsService],
})
export class BadgeModule {}
