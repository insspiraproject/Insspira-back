import { Injectable } from "@nestjs/common";
import { CategoryDto } from "./category.dto";
import { CategoryRepository } from "./category.repository";

@Injectable()
export class CategoryService {
    constructor(private readonly repo:CategoryRepository){}

    async viewService() {
        return await this.repo.createView()
    }

    async categoryService(dto: CategoryDto) {
        return this.repo.createCategory(dto)
    }
}