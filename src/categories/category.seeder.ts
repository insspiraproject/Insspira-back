import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Category } from "./category.entity";
import { categories } from "./seeder";

@Injectable()

export class CategorySeeder {
    constructor(private readonly dataSource: DataSource){}
    async run(){
        const repo = await this.dataSource.getRepository(Category)
        for(const data of categories){
            const exist = await repo.findOne({where: {name: data.name}})
    
            if(!exist){
                await repo.save(repo.create(data))
            }
        }
        console.log("✅ Categories Seeded");
    }
}