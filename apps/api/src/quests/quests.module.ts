import { Module } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { QuestsController } from './quests.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { IpfsModule } from '../ipfs/ipfs.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { BullModule } from '@nestjs/bullmq';
import { BadgeModule } from 'src/badge/badge.module';
import { QuestProcessor } from './quests.processor';
import { QuestSyncProcessor } from './quest-sync.processor';
import { QuestSyncScheduler } from './quest-sync.scheduler';

@Module({
  imports: [
    PrismaModule,
    IpfsModule,
    BlockchainModule,
    BadgeModule,
    BullModule.registerQueue({ name: 'badge-mint' }),
    BullModule.registerQueue({ name: 'quest-create' }),
    BullModule.registerQueue({ name: 'quest-sync' }),
  ],
  providers: [
    QuestsService,
    QuestProcessor,
    QuestSyncProcessor,
    QuestSyncScheduler,
  ],
  controllers: [QuestsController],
})
export class QuestsModule {}
