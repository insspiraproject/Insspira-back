import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sub } from 'src/subscriptions/subscription.entity';
import { In, Repository } from 'typeorm';
import { SubStatus } from 'src/status.enum';
import { Plan } from 'src/plans/plan.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @InjectRepository(Sub)
        private readonly subRepo: Repository<Sub>,
        @InjectRepository(Plan)
        private readonly planRepo: Repository<Plan>,
        private readonly notificationsService: NotificationsService
    ) {}

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
    
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.usersService.createUser({
            email,
            username,
            name,
            phone,
            password: hashedPassword,
            isAdmin: isAdmin || false 
        });
        

        const plan = await this.planRepo.findOne({where: {type: "free"}})
        if(!plan) throw new BadRequestException("This plan not found")
        const subs = this.subRepo.create({
                user,
                plan,
                status: SubStatus.ENABLED
            })    

        const subFree = await this.subRepo.save(subs);

        await this.notificationsService.sendWelcome({
            email: user.email,
            name: user.name,
          });

        const payload = { sub: user.id, email: user.email, name: user.name };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            user: subFree.user.id,
            name: subFree.user.username,
            subscription: subFree.plan
        }
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
    
        if (!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        //Buscar Sub Paga
        let subs = await this.subRepo.findOne({
            where: {user: {id: user.id}, status:  SubStatus.ACTIVE},
            relations: ["plan"]
        })

        //Buscar Sub Gratuita
        if(!subs){
            subs = await this.subRepo.findOne({
                where: { user: { id: user.id }, status: SubStatus.ENABLED },
                relations: ["plan"]
            });

            if(!subs){
            const plan = await this.planRepo.findOne({where: {type: "free"}})
            if(!plan) throw new BadRequestException("This plan not found")

            subs = this.subRepo.create({
                user,
                plan,
                status: SubStatus.ENABLED
            })
            await this.subRepo.save(subs)
            }
        } 

        const payload = { sub: user.id, email: user.email, name: user.name };
        const accessToken = this.jwtService.sign(payload);
        await this.notificationsService.sendWelcome({
            email: user.email,
            name: user.name,
        });

        return {accessToken, subscription: subs.plan}
    }
}