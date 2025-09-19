import { Controller, Param, ParseUUIDPipe, Post, Req, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { CreateSubsDto } from "./subscription.dto";
import { AuthGuard } from "@nestjs/passport";



@Controller("subscriptions")

export class SubscriptionController {

        constructor (private readonly service: SubscriptionService){}

    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post(":id")
    async createSubscription(
        @Param("id", new ParseUUIDPipe()) dto: CreateSubsDto, 
        @Req() req: any
    ){
        const userId = req.user.sub

        return await this.service.create(dto, userId)
    }

  


}



