import { Body, Controller, Post } from "@nestjs/common";
import { categoryDto } from "./category.dto";
import { CategoryService } from "./category.service";

@Controller("category")

export class CategoryController {
    constructor(private readonly service: CategoryService){}

    @Post()
    async createCategory (@Body() dto: categoryDto){
        return await this.service.categoryService(dto)
    }


}
