import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtCookieAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

 
    const token = request.cookies?.['jwt'];


    if (token) {
      request.headers.authorization = `Bearer ${token}`;
    }

    return request;
  }
}