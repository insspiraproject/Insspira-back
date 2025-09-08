import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { PinsService } from "./pins.service";
import { pinsDto } from "./pinsDtos/pins.dto";
import { CreateLikeDto } from "./pinsDtos/like.dto";
import { CommentDto } from "./pinsDtos/comments.dto";


@Controller("pin")


export class PinsController {
    constructor (private readonly service: PinsService){}

    @Get()
    async getAllPins(){
        return await this.service.getPinsService()
    }

    @Get("id")
    async getPins(@Param("id", new ParseUUIDPipe()) id:string){
        return await this.service.getPinsIdService(id)
    }

    @Post()
    async createPins(@Body() dtoPin: pinsDto ){
        return await this.service.postPinsService(dtoPin)
    }

    @Put("id")
    async modifiePins(@Param("id", new ParseUUIDPipe()) dtoPin:pinsDto, id: string){
        await this.service.putPinsService(dtoPin, id)
        return {message: "The post was successfully modified."}
    }

    @Delete("id")
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

    @Post()
    async createComments(@Body() userId: string, pinId:string, comment: CommentDto) {
        return await this.service.commentService(userId, pinId, comment)
    }

    @Put()
    async modifiComments(@Body()  id:string, comment: CommentDto) {
        await this.service.commentModifieService(id, comment)
        return {message: "Your comment has been successfully modified."} 
    }

    @Delete()
    async deleteComments(@Param() id: string) {
        return await this.service.commentDeleteService(id)
    }




}