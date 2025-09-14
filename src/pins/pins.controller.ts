import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { PinsService } from "./pins.service";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { CommentDto } from "./pinsDtos/comments.dto";
import { AuthGuard } from "@nestjs/passport";


@Controller("pins")

export class PinsController {
    constructor (private readonly service: PinsService){}


    // Public search

    @Get("/search")
    async searchPins(@Query("q") query: string){
        return await this.service.serviceSearch(query)
    }

    // Public list / get

    @Get()
    async getAllPins(
        @Query("page") page: number = 1, 
        @Query("limit") limit: number = 20
    ){
        return await this.service.getPinsService(page, limit)
    }

    @Get("/:id")
    async getPins(@Param("id", new ParseUUIDPipe()) id:string){
        return await this.service.getPinsIdService(id)
    }

    // Create pin (auth required)

    @UseGuards(AuthGuard("jwt"))
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPins(
        @Body() dtoPin: pinsDto, 
        @Req() req: any 
    ){
        const idUser = req.user.id
        return await this.service.postPinsService(dtoPin, idUser)
    }

    // Update pin (auth required) - hashtags via query (array)

    // @UseGuards(AuthGuard("jwt"))
    @Put("/:id")
    async modifiePins(
        @Param("id", new ParseUUIDPipe()) pinId: string,
        @Body("hashtags") hashtags: { id: string; tag: string }[], 
        @Body()  dtoPin:updateDto,
        @Req() req: any
            ){
            const userId = "7f7ea51a-927b-431a-89d1-c15fd3c19ddb"  
        await this.service.putPinsService(userId, dtoPin, pinId, hashtags)
        return {message: "The post was successfully modified."}
    }

    // Delete pin (auth required)

    // @UseGuards(AuthGuard("jwt"))
    @Delete("/:id")
    async deletePins(
        @Param("id", new ParseUUIDPipe()) id:string,
        @Req() req
    ){
        const userId = "7f7ea51a-927b-431a-89d1-c15fd3c19ddb"
        await this.service.deletePinsService(id, userId)
        return {message: "Post successfully deleted."}
    }


    // Create Like PINS  (POST, PUT, DELETE) 

    // @UseGuards(AuthGuard("jwt"))
    @Post("/like/:pinsId")
    async createLikes(
        @Param("pinsId", new ParseUUIDPipe()) idPin:string,
        @Req() req
        ){
        const idUser = "7f7ea51a-927b-431a-89d1-c15fd3c19ddb"
        await this.service.likeService(idPin, idUser)
        return{message: "Like added."} 
    }

    // @UseGuards(AuthGuard("jwt"))
    @Delete("/like/:deleteLike")
    async deleteLikes(
        @Param("deleteLike", new ParseUUIDPipe())  id:string,
        @Req() req
    ){
        const userId =  "7f7ea51a-927b-431a-89d1-c15fd3c19ddb"
        await this.service.likeDeleteService(id, userId)
        return {message:"Like removed."}
    }

    // Comments

    // @UseGuards(AuthGuard("jwt"))
    @Post("/comments/:id")
    async createComments(
        @Param("id", new ParseUUIDPipe()) pinId:string,
        @Body() comment: CommentDto,
        @Req() req: any
    ) {
        const userId = "b6a5b521-4dce-4b3d-a8af-21e1525a0adb"
        return await this.service.commentService(userId, pinId, comment)
    }

    // @UseGuards(AuthGuard("jwt"))
    @Put("/modifiComments/:id")
    async modifiComments(
        @Param("id", new ParseUUIDPipe()) id:string,
        @Body()  comment: CommentDto,
        @Req() req: any
    ){
        const userId = "b6a5b521-4dce-4b3d-a8af-21e1525a0adb"
        await this.service.commentModifieService(id, comment,  userId)
        return {message: "Your comment has been successfully modified."} 
    }

    // @UseGuards(AuthGuard("jwt"))
    @Delete("/deleteComments/:id")
    async deleteComments(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Req() req: any
    ) {
        const userId = "b6a5b521-4dce-4b3d-a8af-21e1525a0adb"
        await this.service.commentDeleteService(id, userId)
        return {message: "Comment successfully deleted."} 
    }

    // Views

    // @UseGuards(AuthGuard("jwt"))
    @Post("/view/:id")
    async createView(
        @Param("id", new ParseUUIDPipe()) idPins: string,
        @Req() req
    ){
        const idUser = "0f997ab9-7ce9-4420-965f-0b5203f6e8e4"
        return this.service.viewService(idUser, idPins)
    }
    
    // Saves (user's saved pins)

    // @UseGuards(AuthGuard("jwt"))
    @Get("save/:id")
    async getSavePins(
        @Param('id', new ParseUUIDPipe()) idUser:string,
        @Req() req: any
    ){
        // const idUser = "7f7ea51a-927b-431a-89d1-c15fd3c19ddb"
     
        return await this.service.getSaveService(idUser)
    }

    // @UseGuards(AuthGuard("jwt"))
    @Post("/createSave/:id")
    async savePins(
        @Param("id", new ParseUUIDPipe()) idPins: string,
        @Req() req
    ){
        const idUser = "7f7ea51a-927b-431a-89d1-c15fd3c19ddb"
        return await this.service.saveService(idPins, idUser)
    }

    // @UseGuards(AuthGuard("jwt"))
    @Delete("/saveDelete/:id")
    async deleteSavePins( @Param("id", new ParseUUIDPipe()) id: string, @Req() req){
        const idUser = "7f7ea51a-927b-431a-89d1-c15fd3c19ddb"
        await this.service.deleteSave(id, idUser)
        return {message: "This item was removed successfully."}
    }

}