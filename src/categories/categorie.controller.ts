import { Body, Controller, Post } from "@nestjs/common";
import { categoriDto } from "./categorie.dto";
import { CategoriService } from "./categorie.service";




@Controller("categori")


export class CategoriController {

    constructor(private readonly service: CategoriService){}

    @Post()
    async createCategori (@Body() dto: categoriDto){
        return await this.service.categoriService(dto)

    }


}
