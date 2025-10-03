import {Strategy, Profile} from "passport-google-oidc"
import { config as dotenvConfig } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Plan } from 'src/plans/plan.entity';
import { SubStatus } from 'src/status.enum';
import { Sub } from 'src/subscriptions/subscription.entity';
import { BadRequestException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

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
    private readonly jwt: JwtService){
    super({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `https://api-latest-ejkf.onrender.com/auth/google/callback`,
    scope: ["openid", "email", "profile"],
    prompt: 'login',
    })
  }

  async validate(issuer: string, profile: Profile, done: Function){

    let user = await this.userRepo.findOne({where: { email: profile.emails?.[0]?.value }})

    
    if(user){

      if (!user.provider) {
      user.provider = 'google';
      user.providerId = profile.id;
      await this.userRepo.save(user);
    }


    }  else {

  
    user = this.userRepo.create({

            name: profile.displayName,
            provider: 'google',
            providerId: profile.id,
            email: profile.emails?.[0]?.value,
            username: (profile.displayName ?? "user").replace(/\s/g, '')

        }),


          await this.userRepo.save(user);

           const plan = await this.planRepo.findOne({where: {type: "free"}})
                if(!plan) throw new BadRequestException("This plan not found")
                const subs = this.subRepo.create({
                        user,
                        plan,
                        status: SubStatus.ENABLED
                    })
            await this.subRepo.save(subs)

  }


    const payload = {sub: user.id, email: user.email}
    user["token"] = this.jwt.sign(payload)

    done(null, user)

  }
}