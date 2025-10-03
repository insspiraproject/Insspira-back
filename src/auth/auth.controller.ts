import { Controller, Get, Req, Post, Body, Res, HttpCode, HttpStatus, UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';
import { JwtCookieAuthGuard } from './jwt-cookie-auth-guard';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
      private readonly authService: AuthService) {}

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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async localLogout() {
    return { message: 'Logged out successfully' };
  }


  @Get('me')
  @UseGuards(JwtCookieAuthGuard)
  async getMe(@Req() req: express.Request, res: express.Response) {
      console.log('User in getMe:', req.user);

  if (!req.user) {
    throw new UnauthorizedException('No user found');
  }

  return {
    user: req.user, 
    timestamp: new Date().toISOString(),
  };
  }



  @Get('google')
@UseGuards(AuthGuard('google'))
googleAuth() {
  // passport redirige a Google
}

@Get('google/callback')
@UseGuards(AuthGuard('google'))
async googleCallback(@Req() req: express.Request, @Res() res: express.Response) {
  console.log('>>> callback request reached. req.user =', req.user);
  const { token } = req.user as any;
  if (!token) return res.redirect('https://insspira-front-git-develop-insspiras-projects-818b6651.vercel.app/login?error=notoken');

  res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 3600000, domain: 'api-latest-ejkf.onrender.com' });
  return res.redirect('https://insspira-front-git-develop-insspiras-projects-818b6651.vercel.app/home');
}


@Get("google/logout")
async logout(@Res() res: express.Response) {

  res.clearCookie("jwt");
return res.json({ message: "Sesión cerrada correctamente" });
  }
}



