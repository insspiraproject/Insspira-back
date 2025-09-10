import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { PinsService } from "./pins.service";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { CreateLikeDto } from "./pinsDtos/like.dto";
import { CommentDto } from "./pinsDtos/comments.dto";
import { AuthGuard } from "@nestjs/passport";

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

    @UseGuards(AuthGuard("jwt"))
    @Post("/like/:pinsId")
    async createLikes(
        @Param("pinsId", new ParseUUIDPipe()) idPin:string,
        @Req() req
        ){
        const idUser = req.user.id 
        await this.service.likeService(idPin, idUser)
        return{message: "Like added."} 
    }

    @Delete("/like/:deleteLike")
    async deleteLikes(@Param("deleteLike", new ParseUUIDPipe())  id:string){
        await this.service.likeDeleteService(id)
        return {message:"Like removed."}
    }

    @Post("/comments/:id")
    async createComments(
        @Param("id", new ParseUUIDPipe()) pinId:string,
        @Body() comment: CommentDto,
        @Req() req: any
    ) {
        const userId = "aa0ee65f-6be2-49c9-a3c0-cc9325dfb090"
        return await this.service.commentService(userId, pinId, comment)
    }

    @Put("/modifiComments/:id")
    async modifiComments(
        @Param("id", new ParseUUIDPipe()) id:string,
        @Body()  comment: CommentDto
    ){
        await this.service.commentModifieService(id, comment)
        return {message: "Your comment has been successfully modified."} 
    }

    @Delete("/deleteComments/:id")
    async deleteComments(@Param("id", new ParseUUIDPipe()) id: string) {
        await this.service.commentDeleteService(id)
        return {message: "Comment successfully deleted."} 
    }


}