import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { IpfsService } from '../ipfs/ipfs.service';
import { BlockchainService } from '../blockchain/blockchain.service';
import { CreateQuestDto } from './dto/create-quest.dto';

@Processor('quest-create')
export class QuestProcessor extends WorkerHost {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ipfsService: IpfsService,
    private readonly blockchainService: BlockchainService,
  ) {
    super();
  }

  async process(job: Job<{ data: CreateQuestDto }>) {
    const { data } = job.data;

    console.log('🚀 Async quest creation started', data);

    const cid = await this.ipfsService.uploadJson(data.metadata);
    const metadataHash = `ipfs://${cid}`;

    const endTime = Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60;

    const questTypemap = {
      TX: 0,
      SIGN: 1,
      MULTI: 2,
    };

    const questId = await this.blockchainService.createQuestOnChain(
      metadataHash,
      questTypemap[data.type],
      endTime,
    );

    await this.prisma.quest.create({
      data: {
        id: questId,
        title: data.title,
        description: data.description,
        type: data.type,
        xpReward: data.xpReward,
        metadataHash,
        isActive: true,
      },
    });

    console.log('✅ Quest created async:', questId);
  }
}
