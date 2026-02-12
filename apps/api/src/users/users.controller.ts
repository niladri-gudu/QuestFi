import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/leaderboard')
  async getLeaderboard(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedPage = parseInt(page ?? '1', 10);
    const parsedLimit = parseInt(limit ?? '10', 10);

    return this.usersService.getLeaderBoard(parsedPage, parsedLimit);
  }

  @Get(':wallet')
  async getProfile(@Param('wallet') wallet: string) {
    return this.usersService.getProfile(wallet);
  }
}
