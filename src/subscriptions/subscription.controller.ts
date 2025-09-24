import { Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { AuthGuard } from "@nestjs/passport";



@Controller("subs")

export class SubscriptionController {

        constructor (private readonly service: SubscriptionService){}

    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post(":id")
    async createSubscription(
        @Param("id", new ParseUUIDPipe()) planId: string, 
        @Req() req: any
    ){

        const userId = req.user.sub
        return await this.service.create(planId, userId)
    }

    // @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Get("/free")
    async viewSubscription(
        @Query("userId", new ParseUUIDPipe()) userId: string,
        @Query("planId", new ParseUUIDPipe()) planId: string
    ){

        return await this.service.view(userId, planId)
    }
  


}



