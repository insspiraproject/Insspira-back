// src/application/plans/plan.service.ts

import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DeepPartial } from "typeorm";
import { Plan } from "./plan.entity";
import { partialDto, planDto } from "./plan.dto";


    @Injectable()
    export class PlansService {
    constructor(
        @InjectRepository(Plan)
        private readonly planRepo: Repository<Plan>
        ) {}

        async view() {
        return this.planRepo.find();
        }

        async create(plans: planDto) {
            const plan = this.planRepo.create(plans)
            return await this.planRepo.save(plan)
        }

        async modify(id: string, plan: partialDto) {
            const planId = await this.planRepo.findOne({where: {id: id}})

            if(!planId)throw new NotFoundException("This item not found.")

            const modifyPlans = this.planRepo.merge(planId, plan)
            
            return await this.planRepo.save(modifyPlans)

        }

        async delete(id: string) {
            const planId = await this.planRepo.findOne({where: {id: id}})
            if(!planId)throw new NotFoundException("This item not found.")

            return this.planRepo.delete(planId.id)  
        }

    }