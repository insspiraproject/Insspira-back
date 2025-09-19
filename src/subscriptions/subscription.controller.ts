import { Controller, Param, ParseUUIDPipe, Post, Req, UseGuards } from "@nestjs/common";
import { SubscriptionService } from "./subscription.service";
import { CreateSubsDto } from "./subscription.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiParam } from "@nestjs/swagger";

@ApiTags("Subscriptions")
@Controller("subscriptions")
export class SubscriptionController {
    constructor(private readonly service: SubscriptionService) {}

    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post(":id")
    @ApiParam({
        name: "id",
        type: String,
        description: "UUID del plan al que el usuario desea suscribirse",
        example: "a3e2d7d8-8b4c-4c9f-a123-9a1234567890"
    })
    async createSubscription(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Req() req: any
    ) {
        const userId = req.user.sub;
        return await this.service.create({ plan_id: id, user_id: userId } as CreateSubsDto, userId);
    }
}
