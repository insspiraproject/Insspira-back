import { Controller, Get, Req, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('callback')
    async callback(@Req() req: any, @Res() res: any) {
        // El frontend ya maneja el token, solo validar usuario
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                // Tu JwtStrategy ya valida el token
                const payload = await this.authService.validateAuth0Token(token);
                const user = await this.authService.validateUser(payload);
                
                if (user && user.id && user.email) {
                    req.session = { userId: user.id, email: user.email };
                    return res.redirect('http://localhost:3001/home');
                } else {
                    console.error('User validation failed');
                    return res.redirect('http://localhost:3001/login?error=user_validation');
                }
                
                // REDIRIGIR AL DASHBOARD
                return res.redirect('http://localhost:3001/dashboard');
            } catch (error) {
                console.error('Token validation failed:', error);
                return res.redirect('http://localhost:3001/login?error=invalid_token');
            }
        }
        
        // Si no hay token, redirigir al login
        return res.redirect('http://localhost:3001/login');
    }

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
    @HttpCode(HttpStatus.OK)
    async logout(@Req() req: any, @Res() res: any) {
        
        req.logout((err) => {
            if (err) console.error('Logout error:', err);
        });
        
        const logoutUrl = `${process.env.AUTH0_BASE_URL}/v2/logout?` +
            `client_id=${process.env.AUTH0_CLIENT_ID}&` +
            `returnTo=http://localhost:3001`;
            
        return res.redirect(logoutUrl);
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