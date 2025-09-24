import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { ReportService } from "./report.service";
import { AuthGuard } from "@nestjs/passport";



@Controller("reports")

export class ReportController {
    constructor(private readonly service: ReportService){}

    @Get()
    async viewReport(){}
    
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post()
    async createReport(
        @Body() dto: CreateReportDto,
        @Req() req: any
    ){
        const userId = req.user.sub
        return await this.service.create(dto, userId)
    }

    @Put(":id")
    async modifieReport(){}

    @Delete()
    async deleteReport(){}

    
}