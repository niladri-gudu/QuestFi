import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestsService } from './quests/quests.service';
import { QuestsController } from './quests/quests.controller';
import { QuestsModule } from './quests/quests.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { BlockchainModule } from './blockchain/blockchain.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    QuestsModule,
    IpfsModule,
    BlockchainModule,
    QueueModule,
  ],
  controllers: [AppController, QuestsController],
  providers: [AppService, QuestsService],
})
export class AppModule {}
