import {Injectable} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Sub } from "../../entities/subscription.entity";
import { SubStatus } from "src/rest/types/status.enum";



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