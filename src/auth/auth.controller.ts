import { Controller, Get, Req, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('callback')
    async callback(@Req() req: any, @Res() res: any) {
        // El middleware de express-openid-connect maneja el callback
        // No es necesario duplicar lógica aquí
        if (!req.oidc?.user) {
        return res.redirect('http://localhost:3001/login?error=no_user_data');
        }
        return; // El middleware ya maneja la redirección
    }


  @Get('me')
  @ApiOperation({
    summary: 'Retrieve the current logged-in user information',
    description:
      'Fetches the user information from the current session using OIDC. Returns user data if logged in, otherwise returns a message indicating no user is logged in.',
  })
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
            `returnTo=https://insspira-front-git-develop-insspiras-projects-818b6651.vercel.app/`;
            
        return res.redirect(logoutUrl);
    }



@Post('register')
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({
    summary: 'Register a new user in the system',
    description:
      'Creates a new user account using the provided details. Returns the created user information or error if registration fails.',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }


  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiOperation({
    summary: 'Authenticate a user and create a session',
    description:
      'Logs in a user using email and password. Returns access token and user info on successful authentication.',
  })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}

@ApiTags('App')
@Controller()
export class AppController {
    @Get()
    @ApiOperation({
      summary: 'Redirect to the home page',
      description: 'Simple redirection from the root path to the /home page.',
    })
    redirectToHome(@Res() res) {
        return res.redirect('/home');
    }

    @Get('home')
    getHome(@Req() req: any, @Res() res: any) {
        if (!req.oidc?.user) {
        return res.redirect('http://localhost:3001/login?error=not_authenticated');
        }
        return res.json({ message: 'Welcome to the API', user: req.oidc.user });
    }
}


