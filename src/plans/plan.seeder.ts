import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Plan } from "./plan.entity";
import { PlanFreeMonthlyAnnual } from "./seeder.plan";


@Injectable()



export class PlanSeeder {
    constructor(private readonly dataSource: DataSource){}
    async run(){
        const repo = await this.dataSource.getRepository(Plan)
        for(const data of PlanFreeMonthlyAnnual){
            const exist = await repo.findOne({where: {name: data.name}})
    
            if(!exist){
                await repo.save(repo.create({
                    ...data,
                    type: data.type as 'free' | 'monthly' | 'annual'
                }))
            }
        }
        console.log("✅ Free Plan Seeded");
    }
}


