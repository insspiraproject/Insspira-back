import { CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from "@nestjs/common";
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

       const activate = await this.sub.findOne({
        where:{
            user: {id: user.sub},
            status: In([SubStatus.ENABLED, SubStatus.ACTIVE])
            
        }
       })

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

        // Validar según acción
        switch (action) {
            case ActionType.POST:
            if (activate.dailyPosts >= 3) {
                throw new ForbiddenException('You have reached the daily limit of 3 posts with the free plan');
            }
            activate.dailyPosts++    
            break;

            case ActionType.LIKE:
            if (activate.dailyLikes >= 5) {
                throw new ForbiddenException('You have reached the daily limit of 5 likes with the free plan');
            }
            activate.dailyLikes++;
            break;

            case ActionType.SAVE:
            if (activate.dailySaves >= 2) {
                throw new ForbiddenException('You have reached the daily limit of 2 saves with the free plan');
            }
            activate.dailySaves++;
            break;

            case ActionType.COMMENT:
            if (activate.dailyComments >= 3) {
                throw new ForbiddenException('You have reached the daily limit of 3 comments with the free plan');
            }
            activate.dailyComments++;
            break;
        }
        
        await this.sub.save(activate);
        return true
    }


    
}