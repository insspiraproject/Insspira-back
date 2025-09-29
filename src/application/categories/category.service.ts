import { Injectable } from "@nestjs/common";
import { CategoryDto } from "../../rest/dto/category.dto";
import { CategoryRepository } from "../../rest/repository/category.repository";

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