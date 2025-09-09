import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Categorie } from "./categorie.entity";
import { categoris } from "./seeder";


@Injectable()

export class CategoriSeeder {

    constructor(private readonly dataSource: DataSource){}
 
    async run(){

        const repo = await this.dataSource.getRepository(Categorie)

        for(const data of categoris){
            
            const exist = await repo.findOne({where: {name: data.name}})
    
            if(!exist){
                await repo.save(repo.create(data))
            }
        }

         console.log("✅ Categorías precargadas");


    }


}