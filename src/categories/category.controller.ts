import { Body, Controller, Get, Post } from "@nestjs/common";
import { CategoryDto } from "./category.dto";
import { CategoryService } from "./category.service";

@Controller("category")

export class CategoryController {
    constructor(private readonly service: CategoryService){}

    @Get()
    async viewCategory(){
        return await this.service.viewService()
    }

    @Post()
    async createCategory (@Body() dto: CategoryDto){
        return await this.service.categoryService(dto)
    }


}
