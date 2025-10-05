import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class JwtCookieAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    
    const token = req.cookies?.['jwt']; 
    if (token) req.headers.authorization = `Bearer ${token}`; 
    
    return req;
  }
}