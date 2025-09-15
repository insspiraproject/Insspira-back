import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import axios from 'axios';
// import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
         private readonly jwtService: JwtService,
    ) {}

    async validateUser(payload: any) {
        const sub = payload.sub;               
        const email = payload.email || null;
        const name = payload.name || (email ? email.split('@')[0] : 'user');
    
        let user = await this.usersService.findByAuth0Id(sub);
        if (!user) {
            if (email) {
                const byEmail = await this.usersService.findByEmail(email);
                if (byEmail && !byEmail.auth0Id) {
                byEmail.auth0Id = sub;
                return this.usersService.updateUser(byEmail.id, byEmail);
                }
            }
        
            user = await this.usersService.createUser({
                username: name,
                email,
                phone: null,
                password: null,
                isAdmin: false,
                auth0Id: sub,
              } as any);
            }
            return user;
        }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const response = await axios.post(`${process.env.AUTH0_BASE_URL}/oauth/token`, {
                grant_type: 'refresh_token',
                client_id: process.env.AUTH0_CLIENT_ID,
                client_secret: process.env.AUTH0_CLIENT_SECRET,
                refresh_token: refreshToken,
            });
            return {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token || refreshToken,
            };
            } catch (error) {
            console.error('Error refreshing token:', error.response?.data || error.message);
            throw new Error('Token refresh failed');
            }
        }

    async revokeToken(refreshToken: string): Promise<void> {
        try {
        await axios.post(`${process.env.AUTH0_BASE_URL}/oauth/revoke`, {
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            token: refreshToken,
        });
        console.log('Token has been revoked successfully');
        } catch (error) {
        console.error('Error revoking token:', error.response?.data || error.message);
        throw new Error('The token could not be revoked');
        }
    }


    async register(createUserDto: CreateUserDto){
        const { email, password, confirmPassword, username, name, phone, isAdmin } = createUserDto;
    
        if (!password || !confirmPassword) {
            throw new BadRequestException('Password and confirmPassword are required for local registration');
        }
        if (password !== confirmPassword) {
            throw new BadRequestException('Passwords do not match');
        }
    
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('Email already exists');
        }
    
        // const hashedPassword = await bcrypt.hash(password, 10);
    
        const user = await this.usersService.createUser({
            email,
            username,
            name,
            phone,
            // password: hashedPassword,
            isAdmin: isAdmin || false 
        });
    
        const payload = { sub: user.id, email: user.email, name: user.name };
        const accessToken = this.jwtService.sign(payload);
        return {accessToken}

    }
    
    async login(loginUserDto: LoginUserDto) {
        const { email, password } = loginUserDto;
    
        if (!password) {
            throw new BadRequestException('Password is required for local login');
        }
    
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
    
        if (!user.password) {
            throw new UnauthorizedException('This account uses Auth0 for authentication');
        }
    
        // if (!(await bcrypt.compare(password, user.password))) {
        //     throw new UnauthorizedException('Invalid credentials');
        // }
    
        const payload = { sub: user.id, email: user.email, name: user.name };
        const accessToken = this.jwtService.sign(payload);
    
        return {accessToken}
    
    }
}