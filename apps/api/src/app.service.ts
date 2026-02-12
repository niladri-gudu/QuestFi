import { Injectable } from '@nestjs/common';
import {
  CONTRACT_ADDRESSES,
  QuestRegistry,
  BadgeSBT,
} from '@repo/contract-types';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
