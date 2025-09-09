import { Injectable } from "@nestjs/common";
import { categoriDto } from "./categorie.dto";
import { CategorieRepository } from "./categorie.repository";




@Injectable()

export class CategorieService {
    
    
    constructor(private readonly repo:CategorieRepository){}

    async viewService() {
        return await this.repo.createView()
    }

    async categoriService(dto: categoriDto) {
        return this.repo.createCategori(dto)
    }
}