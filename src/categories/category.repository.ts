import { Injectable } from "@nestjs/common";
import { CategoryDto } from "./category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()

export class CategoryRepository {
    constructor(@InjectRepository(Category)
    private readonly category: Repository<Category>   
    ){}

    async createView() {
        return this.category.find()
    }

    async createCategory(dto: CategoryDto) {
        const categori = this.category.create({name: dto.name})
        return await this.category.save(categori)
    }
}