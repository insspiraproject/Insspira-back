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
        return {message: "La publicación fue modificada con éxito."}
    }

    @Delete("id")
    async deletePins(@Param("id", new ParseUUIDPipe()) id:string){
        await this.service.deletePinsService(id)
        return {message: "Publicación eliminada correctamente."}
    }

    @Post("/:pinsId")
    async createLikes(@Param("pinsId", new ParseUUIDPipe()) likeDto:CreateLikeDto, id:string){
        await this.service.likeService(likeDto, id)
        return{message: "Like agregado."} 
    }

    @Delete("/:deleteLike")
    async deleteLikes(@Param("deleteLike", new ParseUUIDPipe())  id:string){
        await this.service.likeDeleteService(id)
        return {message:"Se ha quitado el like de esta publicación."}
    }

    @Post()
    async createComments(@Body() userId: string, pinId:string, comment: CommentDto) {
        return await this.service.commentService(userId, pinId, comment)
    }

    @Put()
    async modifiComments(@Body()  id:string, comment: CommentDto) {
        await this.service.commentModifieService(id, comment)
        return {message: "Tu comentario se modificó."} 
    }

    @Delete()
    async deleteComments(@Param() id: string) {
        return await this.service.commentDeleteService(id)
    }




}