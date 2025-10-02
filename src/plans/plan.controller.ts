  //src/rest/controller/plan.controller.ts
import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    ParseUUIDPipe, 
    Post, 
    Put, 
    UseGuards
  } from "@nestjs/common";
  import { PlansService } from "./plan.service";
  import { partialDto, planDto } from "./plan.dto";
  import { ApiTags, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
  import { AdminGuard } from "src/admin/admin.guard";
  
  @ApiTags("Plans")
  @Controller("plans")
  export class PlansController {
    constructor(private readonly service: PlansService) {}
  
    @Get()
    @ApiOperation({
      summary: "Get the full list of available plans",
      description: "Retrieves all plans stored in the system, including their details, so clients can view the available options.",
    })
    async viewPlans() {
      return await this.service.view();
    }
    
    @UseGuards(AdminGuard)
    @Post()
    @ApiBody({ type: planDto })
    @ApiOperation({
      summary: "Create and store a new plan",
      description: "Registers a new plan in the database using the provided details, such as name, description, and price.",
    })
    async createPlans(@Body() plans: planDto) {
      return await this.service.create(plans);
    }
  
    @UseGuards(AdminGuard)
    @Put(":id")
    @ApiParam({
      name: "id",
      type: String,
      description: "UUID of the plan to be updated",
      example: "a3e2d7d8-8c4c-4c9f-a123-9a1234567890",
    })
    @ApiBody({ type: partialDto })
    @ApiOperation({
      summary: "Update an existing plan by its UUID",
      description: "Updates the data of an existing plan. Only the provided fields will be modified, leaving the rest unchanged.",
    })
    async modifyPlans(
      @Param("id", new ParseUUIDPipe()) id: string,
      @Body() plan: partialDto,
    ) {
      await this.service.modify(id, plan);
      return { message: "The item was successfully modified." };
    }
  
    @UseGuards(AdminGuard)
    @Delete(":id")
    @ApiParam({
      name: "id",
      type: String,
      description: "UUID of the plan to be deleted",
      example: "b7e5f1a2-4c8d-45f3-b9c9-8d1234567890",
    })
    @ApiOperation({
      summary: "Delete an existing plan permanently",
      description: "Removes a plan from the database by its UUID. Once deleted, the plan will no longer be available for use.",
    })
    async deletePlans(@Param("id", new ParseUUIDPipe()) id: string) {
      await this.service.delete(id);
      return { message: "Item successfully deleted." };
    }
  }



