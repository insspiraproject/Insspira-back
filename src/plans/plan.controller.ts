import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { PlansService } from "./plan.service";
import { partialDto, planDto } from "./plan.dto";


@Controller("plans")


export class PlansController {

    constructor (private readonly service: PlansService){}

    @Get()
    async viewPlans(){
        return await this.service.view()
    }

    @Post()
    async createPlans(
        @Body() plans:planDto
    ){
        return await this.service.create(plans)
    }

    @Put(":id")
    async modifiePlans(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Body() plan: partialDto
    ){
        await this.service.modifie(id, plan)
        return {message: "The item was successfully modified."} 
    }

    @Delete(":id")
    async deletePlans(
        @Param("id", new ParseUUIDPipe()) id: string
    ){
        await this.service.delete(id)
        return {message: "Item successfully deleted."} 
    }


}