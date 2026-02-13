/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuestsService } from './quests.service';
import { CreateQuestDto } from './dto/create-quest.dto';
import { SubmitQuestDto } from './dto/submit-quest.dto';
import { AdminGuard } from '../auth/guards/admin.guards';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createQuest(@Body() body: CreateQuestDto) {
    return this.questsService.createQuest(body);
  }

  @Get()
  async getActiveQuests() {
    return this.questsService.getActiveQuests();
  }

  @Post(':id/submit')
  async submitQuest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SubmitQuestDto,
  ) {
    return this.questsService.submitQuest(id, body);
  }

  @Post('verify/:completionId')
  async verifyQuest(@Param('completionId') completionId: string) {
    return this.questsService.verifyQuest(completionId);
  }
}
