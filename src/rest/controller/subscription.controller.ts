import { Controller, Get, Param, ParseUUIDPipe, Post, Query, Req, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "src/application/subscriptions/subscription.service";




@Controller("subs")

export class SubscriptionController {

    constructor (private readonly service: SubscriptionService){}

   
    
    @Get("/free")
    async viewSubscription(
    ){
        return await this.service.view()
    }
  


}



