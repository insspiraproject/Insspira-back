// src/admin/admin.guard.ts
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwt: JwtService, private users: UsersService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    let userId: string | undefined;
    const auth = req.headers?.authorization;
    if (auth?.startsWith('Bearer ')) {
    try {
    const token = auth.slice(7);
    const payload = await this.jwt.verifyAsync<{ sub?: string }>(token, {
      secret: process.env.JWT_SECRET,
    });
    userId = payload.sub;
    } catch { 

    }
  }

    if (!userId) throw new ForbiddenException('Not authenticated');
    const user = await this.users.getUser(userId);
    if (!user || !user.isAdmin) throw new ForbiddenException('Admins only');
    req.admin = user;
    return true;
  }

}