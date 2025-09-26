import { CanActivate, ExecutionContext, ForbiddenException, NotFoundException, Res } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { ActionType } from "src/pins.enum";
import { SubStatus } from "src/status.enum";
import { Sub } from "src/subscriptions/subscription.entity";
import { In, Repository } from "typeorm";
import { CHECK_LIMIT_KEY } from "../decorators/decorator.pin";




export class PinsGuardPage implements CanActivate {

    constructor(
        @InjectRepository(Sub)
        private readonly sub: Repository<Sub>,
        private readonly reflector: Reflector
    ){}  
   
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const action = this.reflector.getAllAndOverride<ActionType>(
            CHECK_LIMIT_KEY, 
            [context.getHandler(), context.getClass()],
        );
        if(!action) return true;
        
        
        const req = context.switchToHttp().getRequest()
        const user = req.user
        
        if(!user) throw new ForbiddenException("User not found")

        req.action = action;

       const activate = await this.sub.findOne({
        where:{
            user: {id: user.sub},
            status: In([SubStatus.ENABLED, SubStatus.ACTIVE])
            
        }
       })

       req.subscription = activate

        if(!activate) throw new ForbiddenException("You don't have any subscription")
        
        // Reset diario
        const today = new Date().toISOString().split("T")[0];
        if(!activate.lastReset || activate.lastReset.toISOString().split("T")[0] !== today){
            activate.dailyPosts = 0;
            activate.dailyLikes = 0;
            activate.dailySaves = 0;
            activate.dailyComments = 0;
            activate.lastReset = new Date()
            await this.sub.save(activate)
        }

        return true
    }


    
}