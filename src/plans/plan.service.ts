import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Plan } from "./plan.entity";
import { Repository } from "typeorm";
import { partialDto, planDto } from "./plan.dto";


@Injectable()

export class PlansService {

    constructor (
        @InjectRepository(Plan)
        private readonly planRepo: Repository<Plan>){}


    async view() {
        return await this.planRepo.find()
    }

    async create(plans: planDto) {
        const plan = this.planRepo.create(plans)
        return await this.planRepo.save(plan)
    }

    async modifie(id: string, plan: partialDto) {
        const planId = await this.planRepo.findOne({where: {id: id}})

        if(!planId)throw new NotFoundException("This item not found.")

        const modifie = this.planRepo.merge(planId, plan)
        
        return await this.planRepo.save(modifie)

    }

    async delete(id: string) {
          const planId = await this.planRepo.findOne({where: {id: id}})
          if(!planId)throw new NotFoundException("This item not found.")

          return this.planRepo.delete(planId.id)  
    }


}