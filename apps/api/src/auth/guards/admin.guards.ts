/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const wallet = request.headers['x-wallet-address'] as string;

    if (!wallet) {
      throw new ForbiddenException('No wallet address provided');
    }

    const adminWallets =
      process.env.ADMIN_WALLETS?.toLowerCase().split(',') || [];

    const isAdmin = adminWallets.includes(wallet.toLowerCase());

    if (!isAdmin) {
      throw new ForbiddenException('Admin access only');
    }

    return true;
  }
}
