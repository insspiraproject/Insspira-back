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
        'Logs in a user using email and password. Returns an access token and user info on successful authentication.',
    })
    async login(@Body() loginUserDto: LoginUserDto) {
      return this.authService.login(loginUserDto);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
      summary: 'Log out the current user session',
      description:
        'Terminates the authenticated session for the currently logged-in user.',
    })
    async localLogout() {
      return { message: 'Logged out successfully' };
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({
      summary: 'Google authentication callback',
      description:
        'Handles the callback from Google OAuth, sets the authentication cookie, and redirects the user to the dashboard.',
    })
    async googleCallback(@Req() req: express.Request, @Res() res: express.Response) {
      const user = req.user
      const token = user?.token

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000 
      })

      res.redirect("https://insspira-front-git-vercel-insspiras-projects-818b6651.vercel.app/dashboard")
    }

    @Get("google/logout")
    @ApiOperation({
      summary: 'Log out from Google session',
      description:
        'Destroys the current Google OAuth session, clears cookies, and confirms logout to the client.',
    })
    async logout (@Req() req: express.Request, @Res() res: express.Response){
      if (req.session) {
        req.session.destroy(err => {
          if (err) return res.status(500).json({ message: "Error al destruir la sesión" });

          res.clearCookie("connect.sid");
          return res.json({ message: "Sesión cerrada correctamente" });
        });
      } else {
        res.clearCookie("connect.sid");
        return res.json({ message: "Sesión ya estaba cerrada" });
      }
    }
}

   




