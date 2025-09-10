import { Injectable } from "@nestjs/common";
import { categoryDto } from "./category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { Repository } from "typeorm";

@Injectable()

export class CategoryRepository { 
    constructor(@InjectRepository(Category)
    private readonly category: Repository<Category>) {}

    async createCategory(dto: categoryDto) {
        const category = this.category.create({name: dto.name})
        return await this.category.save(category)
    }

    async createView() {
        return this.category.find()
    }
}