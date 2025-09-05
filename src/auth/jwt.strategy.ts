import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKeyProvider: passportJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `${process.env.AUTH0_BASE_URL}/.well-known/jwks.json`,
        }),
        issuer: `${process.env.AUTH0_BASE_URL}/`,
        audience: process.env.AUTH0_AUDIENCE,
        });
    }

    async validate(payload: any) {
        return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        };
    }
}