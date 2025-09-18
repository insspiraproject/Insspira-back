import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { PlansService } from "./plan.service";
import { partialDto, planDto } from "./plan.dto";
import { ApiTags, ApiBody, ApiParam, ApiOperation } from "@nestjs/swagger";

@ApiTags('Plans')
@Controller("plans")
export class PlansController {

    constructor(private readonly service: PlansService){}

    @Get()
    @ApiOperation({ summary: 'Obtener todos los planes disponibles' })
    async viewPlans(){
        return await this.service.view()
    }

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo plan' })
    @ApiBody({ type: planDto })
    async createPlans(@Body() plans: planDto){
        return await this.service.create(plans)
    }

    @Put(":id")
    @ApiOperation({ summary: 'Modificar un plan existente (parcialmente)' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'UUID del plan a modificar',
        example: 'a3e2d7d8-8b4c-4c9f-a123-9a1234567890'
    })
    @ApiBody({ type: partialDto })
    async modifiePlans(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Body() plan: partialDto
    ){
        await this.service.modifie(id, plan)
        return {message: "The item was successfully modified."} 
    }

    @Delete(":id")
    @ApiOperation({ summary: 'Eliminar un plan existente' })
    @ApiParam({
        name: 'id',
        type: String,
        description: 'UUID del plan a eliminar',
        example: 'a3e2d7d8-8b4c-4c9f-a123-9a1234567890'
    })
    async deletePlans(@Param("id", new ParseUUIDPipe()) id: string){
        await this.service.delete(id)
        return {message: "Item successfully deleted."} 
    }
}
