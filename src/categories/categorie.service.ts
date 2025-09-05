import { Injectable } from "@nestjs/common";
import { categoriDto } from "./categorie.dto";
import { CategoriRepository } from "./categorie.repository";




@Injectable()

export class CategoriService {
    
    constructor(private readonly repo:CategoriRepository){}

    async categoriService(dto: categoriDto) {
        return this.repo.createCategori(dto)
    }
}