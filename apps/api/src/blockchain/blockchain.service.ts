import { Injectable } from '@nestjs/common';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

@Injectable()
export class BlockchainService {
  private client = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  async getTransaction(txHash: string) {
    return this.client.getTransaction({
      hash: txHash as `0x${string}`,
    });
  }

  async getTransactionReceipt(txHash: string) {
    return this.client.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });
  }
}
