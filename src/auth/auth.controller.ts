import { Controller, Get, Req, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

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

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }
}

@Controller()
export class AppController {
    @Get()
    redirectToHome(@Res() res) {
        return res.redirect('/home');
    }
}