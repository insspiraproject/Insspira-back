import { Injectable } from "@nestjs/common";
import { categoriDto } from "./categorie.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Categorie } from "./categorie.entity";
import { Repository } from "typeorm";




@Injectable()

export class CategorieRepository {
    
    
    constructor(@InjectRepository(Categorie)
    private readonly categori: Repository<Categorie>   
    ){}

    async createView() {
        return this.categori.find()
    }

    async createCategori(dto: categoriDto) {

        const categori = this.categori.create({name: dto.name})
        return await this.categori.save(categori)
        }
}