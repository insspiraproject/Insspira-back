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
        @InjectRepository(Sub)
        private readonly subRepo: Repository<Sub>
    ){}

   

    async view() {
        return await this.subRepo.find()
    }


}