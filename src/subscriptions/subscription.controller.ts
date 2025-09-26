import { Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { AuthGuard } from "@nestjs/passport";



@Controller("subs")

export class SubscriptionController {

    constructor (private readonly service: SubscriptionService){}

   
    
    @Get("/free")
    async viewSubscription(
    ){
        return await this.service.view()
    }
  


}



