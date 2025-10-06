import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {Strategy, Profile} from "passport-google-oidc"
import { config as dotenvConfig } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Plan } from 'src/plans/plan.entity';
import { SubStatus } from 'src/status.enum';
import { Sub } from 'src/subscriptions/subscription.entity';
import { NotificationsService } from 'src/notifications/notifications.service';


dotenvConfig();

@Injectable()
export class GoogleOidcStrategy extends PassportStrategy(Strategy, "google"){

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User> ,
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan> ,
    @InjectRepository(Sub)
    private readonly subRepo: Repository<Sub> ,
    private readonly jwt: JwtService,
      private readonly notificationsService: NotificationsService
    
  ){

      super({
      
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ["openid", "email", "profile"],
    prompt: 'login',
    }) 
    
  }

   async validate(issuer: string, profile: Profile) {
  let user = await this.userRepo.findOne({ where: { email: profile.emails?.[0]?.value } });
  if (!user) {
    user = this.userRepo.create({
      name: profile.displayName,
      provider: 'google',
      providerId: profile.id,
      email: profile.emails?.[0]?.value,
      username: (profile.displayName ?? "user").replace(/\s/g, ''),
    });
    await this.userRepo.save(user);
           
  await this.notificationsService.sendWelcome({
    email: user.email,
    name: user.name,
  });
 
  

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
  }

  const payload = { sub: user.id, email: user.email, name: user.name };
  const token = await this.jwt.signAsync(payload);

  return { ...user, token }; 
}

  
  
  }
    
    

  

