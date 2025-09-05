import { Injectable } from "@nestjs/common";
import { categoriDto } from "./categorie.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Categori } from "./categorie.entity";
import { Repository } from "typeorm";




@Injectable()

export class CategoriRepository {
    
    constructor(@InjectRepository(Categori)
    private readonly categori: Repository<Categori>   
    ){

    }

    async createCategori(dto: categoriDto) {

        const categori = this.categori.create({name: dto.name})
        return await this.categori.save(categori)
        }
}