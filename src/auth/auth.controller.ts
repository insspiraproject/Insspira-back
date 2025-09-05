import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
    ) {}

    @Get('login')
    login(@Res() res: Response) {
        const authorizeUrl = new URL(`${process.env.AUTH0_BASE_URL}/authorize`);
        authorizeUrl.searchParams.set('response_type', 'code');       
        authorizeUrl.searchParams.set('client_id', process.env.AUTH0_CLIENT_ID!);
        authorizeUrl.searchParams.set('redirect_uri', 'http://localhost:3000/auth/callback');
        authorizeUrl.searchParams.set('scope', 'openid profile email offline_access'); 
        authorizeUrl.searchParams.set('audience', process.env.AUTH0_AUDIENCE!);

        return res.redirect(authorizeUrl.toString());
    }

    @Get('callback')
    async callback(@Query('code') code: string) {
        console.log('Code recibido:', code);
        const tokenResponse = await axios.post(`${process.env.AUTH0_BASE_URL}/oauth/token`, {
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: 'http://localhost:3000/auth/callback',
        });

        console.log('Token response from Auth0:', tokenResponse.data);
        const { access_token, refresh_token, id_token } = tokenResponse.data;

        const payload: any = this.jwtService.decode(id_token);
        const user = await this.authService.validateUser(payload);

        return { user, access_token, refresh_token };

    }

    @Post('refresh')
    async refresh(@Req() req: Request) {
        const refreshToken = req.body.refreshToken;
        return this.authService.refreshToken(refreshToken);
    }

    @Post('logout')
    async logout(@Req() req: Request) {
        const refreshToken = req.body.refreshToken; 
        if (refreshToken) {
        await this.authService.revokeToken(refreshToken);
        }
        return { message: 'Logout successful' };
    }
}