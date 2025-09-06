import { Controller, Get, Req, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('me')
    async me(@Req() req: any) { 
        const oidcUser = req.oidc?.user;
        if (!oidcUser) return { message: 'No logged in' };

        const user = await this.authService.validateUser({
        sub: oidcUser.sub,
        email: oidcUser.email,
        name: oidcUser.name,
        });

        return { user, oidcUser };
    }

    @Post('logout')
    logout(@Req() req: any) {
        req.logout(); 
        return { message: 'Logout successful' };
    }
}