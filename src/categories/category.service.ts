import { Injectable } from "@nestjs/common";
import { categoryDto } from "./category.dto";
import { CategoryRepository } from "./category.repository";

@Injectable()
export class CategoryService { 
    constructor(private readonly repo:CategoryRepository){}

    async categoryService(dto: categoryDto) {
        return this.repo.createCategory(dto)
    }

    async viewService() {
        return await this.repo.createView()
    }
}