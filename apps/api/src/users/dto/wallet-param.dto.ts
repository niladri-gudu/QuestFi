/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, Matches } from 'class-validator';
export class WalletParamDto {
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/)
  wallet: string;
}
