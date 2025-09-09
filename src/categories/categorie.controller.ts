import { Body, Controller, Get, Post } from "@nestjs/common";
import { categoriDto } from "./categorie.dto";
import { CategorieService } from "./categorie.service";




@Controller("categori")


export class CategorieController {

    constructor(private readonly service: CategorieService){}

    @Get()
    async viewCategori(){
        return await this.service.viewService()
    }

    @Post()
    async createCategori (@Body() dto: categoriDto){
        return await this.service.categoriService(dto)

    }


}
