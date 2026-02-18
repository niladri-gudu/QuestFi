import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QuestSyncScheduler implements OnModuleInit {
  constructor(
    @InjectQueue('quest-sync')
    private readonly syncQueue: Queue,
  ) {}

  async onModuleInit() {
    const existing = await this.syncQueue.getRepeatableJobs();
    const alreadyExists = existing.some(
      (job) => job.name === 'sync-onchain-quests',
    );

    if (alreadyExists) {
      console.log('⏱ Quest sync cron already registered');
      return;
    }

    await this.syncQueue.add(
      'sync-onchain-quests',
      {},
      {
        repeat: {
          every: 24 * 60 * 60 * 1000,
        },
        removeOnComplete: true,
      },
    );

    console.log('⏱ Quest sync cron scheduled (every 24 hours)');
  }
}
