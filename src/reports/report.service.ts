import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { ReportStatus } from "src/report.enum";



@Injectable()

export class ReportService {
   
    
    

    constructor(
        @InjectRepository(Report)
        private readonly report: Repository<Report>,
        @InjectRepository(User)
        private readonly user: Repository<User>,

    ){}


    async view() {
        return await this.report.find()
    }


    async create(dto: CreateReportDto, userId: string) {
          const user = await this.user.findOne({where: {id: userId}})
        if(!user) throw new NotFoundException("User not found.")

          const exist = await this.report.findOne({
            where: {user: {id: user.id}, targetId: dto.targetId, targetType: dto.targetType}
          })  
          if(exist) throw new BadRequestException("You already reported this resource.");


        const report = this.report.create({
            ...dto,
            user,
            status: ReportStatus.PENDING
        })
        
        await this.report.save(report)
        
        return {
            id: report.user.id,
            user: report.user.username,
            name: report.user.name,
            email: report.user.email,
            report: report.type,
            target: report.targetType,
            targetId: report.targetId,
            reason: report.reason,
            date: report.createdAt
        }}



    async delete(userId: string, id: string) {
      const user = await this.user.findOne({where: {id: userId, isAdmin: true}, })
        if(!user) throw new NotFoundException("Admin user not found.")

      const exist = await this.report.findOne({
          where: {id: id}
        })  
        if(!exist) throw new BadRequestException("Reported not found");

        return await this.report.remove(exist)

    }
}