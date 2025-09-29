import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

import { CreateReportDto } from "../dto/create-report.dto";
import { ReportService } from "src/application/reports/report.service";


@Controller("reports")

export class ReportController {
    constructor(private readonly service: ReportService){}

    @Get()
    async viewReport(){
        return await this.service.view()
    }
    
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post()
    async createReport(
        @Body() dto: CreateReportDto,
        @Req() req: any
    ){
        const userId = req.user.sub
        return await this.service.create(dto, userId)
    }

    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Put(":id")
    async modifieReport(){}

    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Delete(":id")
    async deleteReport(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Req() req: any
    ){
        
        const userId = req.user.sub
        console.log(userId);
        return await this.service.delete(userId, id)
    }

    
}