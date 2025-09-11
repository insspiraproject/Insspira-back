import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common";
import { PinsService } from "./pins.service";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { CreateLikeDto } from "./pinsDtos/like.dto";
import { CommentDto } from "./pinsDtos/comments.dto";

@Controller("pin")

export class PinsController {
    constructor (private readonly service: PinsService){}

    @Get()
    async getAllPins(){
        return await this.service.getPinsService()
    }

    @Get("/search")
    async searchPins(@Query("q") query: string){
        return await this.service.serviceSearch(query)
    }

    @Get("/:id")
    async getPins(@Param("id", new ParseUUIDPipe()) id:string){
        return await this.service.getPinsIdService(id)
    }

    @Post()
    async createPins(@Body() dtoPin: pinsDto , idCategori:string, idUser:string){
        return await this.service.postPinsService(dtoPin, idCategori, idUser)
    }

    @Put("/:id")
    async modifiePins(
        @Param("id", new ParseUUIDPipe()) userId: string,
        @Query("hashtags") hashtagId: string[], 
        @Body()  dtoPin:updateDto,
            ){
        await this.service.putPinsService(dtoPin, userId, hashtagId)
        return {message: "The post was successfully modified."}
    }

    @Delete("/:id")
    async deletePins(@Param("id", new ParseUUIDPipe()) id:string){
        await this.service.deletePinsService(id)
        return {message: "Post successfully deleted."}
    }

    @Post("/:pinsId")
    async createLikes(@Param("pinsId", new ParseUUIDPipe()) likeDto:CreateLikeDto, id:string){
        await this.service.likeService(likeDto, id)
        return{message: "Like added."} 
    }

    @Delete("/:deleteLike")
    async deleteLikes(@Param("deleteLike", new ParseUUIDPipe())  id:string){
        await this.service.likeDeleteService(id)
        return {message:"Like removed."}
    }

    @Post("/comments")
    async createComments(@Body() userId: string, pinId:string, comment: CommentDto) {
        return await this.service.commentService(userId, pinId, comment)
    }

    @Put("/modifiComments")
    async modifiComments(@Body()  id:string, comment: CommentDto) {
        await this.service.commentModifieService(id, comment)
        return {message: "Your comment has been successfully modified."} 
    }

    @Delete("/deleteComments")
    async deleteComments(@Param() id: string) {
        return await this.service.commentDeleteService(id)
    }
}