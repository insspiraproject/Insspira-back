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
  if (!token) return res.redirect('http://localhost:3001/login?error=notoken');

  res.cookie('jwt', token, {
    httpOnly: true, 
    secure: true, 
    sameSite: 'none', 
    maxAge: 3600000 
  });

  return res.redirect('http://localhost:3001/home');
}


  @Get("google/logout")
    async logout(@Res() res: express.Response, @Req() req: express.Request) {

  //   const cookieOptions = {
  //    httpOnly: true,
  //   secure: true,
  //   sameSite: 'none' as const
  // };

  //   res.clearCookie('jwt', cookieOptions);

    
  //   if (req.session) {
  //       req.session.destroy((err) => {
  //           if (err) {
  //               console.error("Error destroying session:", err);
  //           }
  //       });
  //   }
  //   return res.json({message: "Sesión cerrada correctamente"});
try {
    console.log('=== INICIANDO LOGOUT COMPLETO ===');
    
    // Opciones para localhost (desarrollo)
    const cookieOptions = {
      httpOnly: true,
      secure: false, // ⚠️ En localhost secure debe ser false
      sameSite: 'lax' as const // ⚠️ En localhost sameSite: 'lax'
    };

    // Limpiar TODAS las cookies de auth
    res.clearCookie('jwt', cookieOptions);
    res.clearCookie('connect.sid', cookieOptions);
    res.clearCookie('session', cookieOptions);
    
    console.log('Cookies limpiadas:', ['jwt', 'connect.sid', 'session']);

    // Destruir la sesión del servidor
    return new Promise((resolve) => {
      if (req.session) {
        console.log('Destruyendo sesión de Passport...');
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
          } else {
            console.log('Sesión de Passport destruida');
          }
          
          res.json({ 
            success: true, 
            message: "Sesión cerrada correctamente" 
          });
          resolve(null);
        });
      } else {
        console.log('No había sesión activa');
        res.json({ 
          success: true, 
          message: "Sesión cerrada correctamente" 
        });
        resolve(null);
      }
    });

  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error al cerrar sesión" 
    });
  }
   

    }
   



}
