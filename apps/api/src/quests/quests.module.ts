import { Module } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IpfsModule } from '../ipfs/ipfs.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { BullModule } from '@nestjs/bullmq';
import { BadgeModule } from 'src/badge/badge.module';

@Module({
  imports: [
    PrismaModule,
    IpfsModule,
    BlockchainModule,
    BadgeModule,
    BullModule.registerQueue({ name: 'badge-mint' }),
  ],
  providers: [QuestsService],
  controllers: [QuestsController],
})
export class QuestsModule {}
