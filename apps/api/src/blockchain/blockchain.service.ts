/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { createWalletClient, createPublicClient, http, verifyMessage } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { decodeEventLog } from 'viem';
import {
  CONTRACT_ADDRESSES,
  BadgeSBT,
  QuestRegistry,
} from '@repo/contract-types';

@Injectable()
export class BlockchainService {
  private account = privateKeyToAccount(
    process.env.BACKEND_PRIVATE_KEY as `0x${string}`,
  );
  private publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });
  private walletClient = createWalletClient({
    account: this.account,
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  async createQuestOnChain(
    metadataHash: string,
    questType: number,
    endTime: number,
  ): Promise<number> {
    const hash = await this.walletClient.writeContract({
      address: CONTRACT_ADDRESSES.QuestRegistry as `0x${string}`,
      abi: QuestRegistry,
      functionName: 'createQuest',
      args: [metadataHash, questType, BigInt(endTime)],
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash,
      timeout: 60_000,
    });

    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: QuestRegistry,
          data: log.data,
          topics: log.topics,
        });

        if (
          decoded.eventName === 'QuestCreated' &&
          log.topics.length > 1 &&
          log.topics[1]
        ) {
          return Number(BigInt(log.topics[1]));
        }
      } catch (error) {
        continue;
      }
    }
    throw new Error('QuestCreated event not found in transaction logs');
  }

  async getTransaction(txHash: string) {
    return this.publicClient.getTransaction({
      hash: txHash as `0x${string}`,
    });
  }

  async getTransactionReceipt(txHash: string) {
    return this.publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });
  }

  async verifySepoliaTransaction(
    txHash: string,
    wallet: string,
    metadata: any,
  ): Promise<boolean> {
    const tx = await this.getTransaction(txHash);
    const receipt = await this.getTransactionReceipt(txHash);

    if (!tx || !receipt) {
      console.log('❌ Missing tx or receipt');
      return false;
    }

    if (receipt.status !== 'success') {
      console.log('❌ Receipt not success');
      return false;
    }

    if (tx.from.toLowerCase() !== wallet.toLowerCase()) {
      console.log('❌ Wallet mismatch');
      return false;
    }

    if (!tx.to) {
      console.log('❌ tx.to missing');
      return false;
    }

    if (tx.to.toLowerCase() !== metadata.contractAddress.toLowerCase()) {
      console.log('❌ Contract address mismatch');
      return false;
    }

    const txValue = BigInt(tx.value);
    const minValue = BigInt(metadata.minValue);

    if (txValue < minValue) {
      console.log('❌ Value too small');
      return false;
    }

    return true;
  }

  async isQuestActiveOnChain(questId: number): Promise<boolean> {
    try {
      const result = await this.publicClient.readContract({
        address: CONTRACT_ADDRESSES.QuestRegistry as `0x${string}`,
        abi: QuestRegistry,
        functionName: 'isQuestActive',
        args: [BigInt(questId)],
      });

      return Boolean(result);
    } catch (error) {
      return false;
    }
  }

  async getQuestMetadataOnChain(questId: number): Promise<string> {
    const result = await this.publicClient.readContract({
      address: CONTRACT_ADDRESSES.QuestRegistry as `0x${string}`,
      abi: QuestRegistry,
      functionName: 'getQuestMetadata',
      args: [BigInt(questId)],
    });
    return String(result);
  }

  async mintBadgeOnChain(
    userAddress: string,
    tokenURI: string,
  ): Promise<number> {
    const hash = await this.walletClient.writeContract({
      address: CONTRACT_ADDRESSES.BadgeSBT as `0x${string}`,
      abi: BadgeSBT,
      functionName: 'mintBadge',
      args: [userAddress as `0x${string}`, tokenURI],
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash,
      timeout: 60_000,
    });

    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: BadgeSBT,
          data: log.data,
          topics: log.topics,
        });

        if (
          decoded.eventName === 'BadgeMinted' &&
          log.topics.length > 2 &&
          log.topics[2]
        ) {
          return Number(BigInt(log.topics[2]));
        }
      } catch (error) {
        continue;
      }
    }

    throw new Error('BadgeMinted event not found');
  }

  async verifySignature(
    wallet: string,
    signature: string,
    message: string,
  ): Promise<boolean> {
    try {
      const valid = await verifyMessage({
        address: wallet as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });

      return valid;
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }
}
