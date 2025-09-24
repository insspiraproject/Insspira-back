import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Plan } from "src/plans/plan.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { Sub } from "./subscription.entity";
import { SubStatus } from "src/status.enum";



@Injectable()

export class SubscriptionService {
   

    constructor (
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Plan)
        private readonly planRepo: Repository<Plan>,
        @InjectRepository(Sub)
        private readonly subRepo: Repository<Sub>
    ){}

    async create(planId: string, userId: string) {
        
        const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("User not found")

            
        const plan = await this.planRepo.findOne({where: {id: planId}})
        if(!plan) throw new NotFoundException("Plan not found")
            
        const existing = await this.subRepo.findOne({
            where:{
                user: {id: user.id},
                plan: {id: plan.id}, 
                status: SubStatus.ENABLED,
            }
        })    
        if(existing) throw new ConflictException("User already subscribed to this plan.")
        
        const subs = this.subRepo.create({
            user,
            plan,
            status: SubStatus.ENABLED
        })    

        return await this.subRepo.save(subs)
    }


    async view(userId: string, planId:string) {
         const user = await this.userRepo.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("User not found")

        const plan = await this.planRepo.findOne({where: {id: planId}})
        if(!plan) throw new NotFoundException("Plan not found")

        const subscription = await this.subRepo.findOne({
            where: {
                user: user,
                plan: plan
            },
            relations: ["user", "plan"]
           }) 
         if (!subscription) throw new NotFoundException("Subscription not found")   

           return {
            user: subscription?.user.username,
            plan: subscription?.plan.name,
            status: subscription?.status,
            init: subscription?.start_date
           }

    }


}