import { Controller, Get, Req, Post, Body, Res, HttpCode, HttpStatus, UseGuards, UnauthorizedException } from '@nestjs/common';
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
    constructor(private readonly authService: AuthService) {}

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
  async getMe(@Req() req: express.Request) {

    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  // Este método nunca se ejecuta, Passport redirige a Google automáticamente
  }


  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: express.Request, @Res() res: express.Response) {
    const user = req.user
    const token = user?.token

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true, 
      sameSite: 'none',
      maxAge: 60 * 60 * 1000 
    })

      const redirectUrl =
    process.env.NODE_ENV === "production"
      ? "https://insspira-front-git-develop-insspiras-projects-818b6651.vercel.app/home"
      : "http://localhost:3001/home";

    res.redirect(redirectUrl)
  }

  @Get("google/logout")
    async logout(@Res() res: express.Response) {

      res.clearCookie("jwt");
    return res.json({ message: "Sesión cerrada correctamente" });
    }

  // @Get("google/logout")
  // async logout (@Req() req: express.Request, @Res() res: express.Response){

  // if (req.session) {
  //   req.session.destroy(err => {
  //     if (err) return res.status(500).json({ message: "Error al destruir la sesión" });

  //     res.clearCookie("connect.sid");
  //     return res.json({ message: "Sesión cerrada correctamente" });
  //   });
  // } else {
  //   res.clearCookie("connect.sid");
  //   return res.json({ message: "Sesión ya estaba cerrada" });
  // }
  // }
  //  
}
