import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { BlockchainService } from '../blockchain/blockchain.service';

@Processor('quest-sync')
export class QuestSyncProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly blockchainService: BlockchainService,
  ) {
    super();
  }

  async process(job: Job<any>) {
    console.log('🔄 Running quest on-chain sync...');

    const quests = await this.prisma.quest.findMany({
      where: { isActive: true },
    });

    for (const quest of quests) {
      try {
        const onChainActive = await this.blockchainService.isQuestActiveOnChain(
          quest.id,
        );

        if (!onChainActive) {
          await this.prisma.quest.update({
            where: { id: quest.id },
            data: { isActive: false },
          });

          console.log(`⛔ Quest ${quest.id} deactivated (on-chain)`);
        }
      } catch (err) {
        console.error(`Sync error for quest ${quest.id}`, err);
      }
    }

    console.log('✅ Quest sync complete');
  }
}
