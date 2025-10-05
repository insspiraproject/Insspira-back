import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class LocalJwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        
        (req: Request) => {
           console.log('Extracting JWT from cookies:', req.cookies);
          console.log('JWT cookie value:', req.cookies?.jwt);
          if (req && req.cookies) {
            return req.cookies.jwt;
          }
          return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken()
      ]),
  
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret',
    });
  }

  async validate(payload: any) {
    return { sub: payload.sub, email: payload.email, id: payload.sub};
  }
}

