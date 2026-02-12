/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  Min,
} from 'class-validator';

export enum QuestType {
  TX = 'TX',
  SIGN = 'SIGN',
  MULTI = 'MULTI',
}

export class CreateQuestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(QuestType)
  type: QuestType;

  @IsInt()
  @Min(1)
  xpReward: number;

  @IsObject()
  metadata: Record<string, any>;
}
