import { Body, Controller, Get, Post } from "@nestjs/common";

import { ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";
import { CategoryService } from "src/application/categories/category.service";
import { CategoryDto } from "../dto/category.dto";

@ApiTags("Categories")
@Controller("category")
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  @ApiOperation({
    summary: "Retrieve all categories from the system",
    description:
      "Fetches the complete list of categories stored in the database. This endpoint is useful for displaying all available categories to clients or for administrative purposes.",
  })
  async viewCategory() {
    return await this.service.viewService();
  }

  @Post()
  @ApiBody({ type: CategoryDto })
  @ApiOperation({
    summary: "Create and register a new category",
    description:
      "Creates a new category in the system using the provided details. The request body must include the category information as defined in the CategoryDto.",
  })
  async createCategory(@Body() dto: CategoryDto) {
    return await this.service.categoryService(dto);
  }
}
