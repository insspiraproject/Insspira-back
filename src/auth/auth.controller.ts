import { Controller, Get, Req, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('me')
    @ApiOperation({ summary: 'Obtener información del usuario autenticado' })
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
    @ApiOperation({ summary: 'Cerrar sesión del usuario actual' })
    logout(@Req() req: any) {
        req.logout(); 
        return { message: 'Logout successful' };
    }

    @Post('register')
    @ApiOperation({ summary: 'Registrar un nuevo usuario' })
    @ApiBody({ type: CreateUserDto })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Iniciar sesión de un usuario' })
    @ApiBody({ type: LoginUserDto })
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    


}

@Controller()
export class AppController {
    @Get()
    @ApiOperation({ summary: 'Redirige a la página de inicio' })
    redirectToHome(@Res() res) {

        return res.redirect('http://localhost:3001/home');
    }
}
