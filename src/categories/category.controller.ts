import { Body, Controller, Get, Post } from "@nestjs/common";
import { CategoryDto } from "./category.dto";
import { CategoryService } from "./category.service";
import { ApiTags, ApiBody, ApiOperation } from "@nestjs/swagger";

@ApiTags('Category')
@Controller("category")
export class CategoryController {
    constructor(private readonly service: CategoryService){}

    @Get()
    @ApiOperation({ summary: 'Obtener todas las categorías disponibles' })
    async viewCategory(){
        return await this.service.viewService()
    }

    @Post()
    @ApiOperation({ summary: 'Crear una nueva categoría' })
    @ApiBody({ type: CategoryDto })
    async createCategory(@Body() dto: CategoryDto){
        return await this.service.categoryService(dto)
    }
}
