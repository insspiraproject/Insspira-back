import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { PinsService } from "./pins.service";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { CommentDto } from "./pinsDtos/comments.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("pins")

export class PinsController {
    constructor (private readonly service: PinsService){}

    // Public search
    //* Ok
    @Get("/search")
    async searchPins(@Query("q") query: string){
        return await this.service.serviceSearch(query)
    }

    // Public list / get
    //* Ok
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
    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPins(
        @Body() dtoPin: pinsDto, 
        @Req() req: any 
    ){
        const idUser = req.user.sub
        return await this.service.postPinsService(dtoPin, idUser)
    }

    // Update pin (auth required) - hashtags via query (array)
    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Put("/:id")
    async modifiePins(
        @Param("id", new ParseUUIDPipe()) pinId: string,
        @Body("hashtags") hashtags: { id: string; tag: string }[], 
        @Body()  dtoPin:updateDto,
        @Req() req: any
            ){
            const userId = req.user.sub
        await this.service.putPinsService(userId, dtoPin, pinId, hashtags)
        return {message: "The post was successfully modified."}
    }

    // Delete pin (auth required)
    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Delete("/:id")
    async deletePins(
        @Param("id", new ParseUUIDPipe()) id:string,
        @Req() req: any
    ){
        const userId = req.user.sub
        await this.service.deletePinsService(id, userId)
        return {message: "Post successfully deleted."}
    }


    // Create Like ) 
    //*OK
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post("/like/:id")
    async createLikes(
        @Param("id", new ParseUUIDPipe()) idPin:string,
        @Req() req: any
        ){
        const idUser = req.user.sub
        await this.service.likeService(idPin, idUser)
        return{message: "Like added."} 
    }

    //*OK
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Delete("/like/:deleteLike")
    async deleteLikes(
        @Param("deleteLike", new ParseUUIDPipe())  id:string,
        @Req() req: any
    ){
        const userId = req.user.sub
        await this.service.likeDeleteService(id, userId)
        return {message:"Like removed."}
    }

    // Comments
    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post("/comments/:id")
    async createComments(
        @Param("id", new ParseUUIDPipe()) pinId:string,
        @Body() comment: CommentDto,
        @Req() req: any
    ) {
        const userId = req.user.sub
        return await this.service.commentService(userId, pinId, comment)
    }

    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Put("/modifiComments/:id")
    async modifiComments(
        @Param("id", new ParseUUIDPipe()) id:string,
        @Body()  comment: CommentDto,
        @Req() req: any
    ){
        const userId = req.user.sub
        await this.service.commentModifieService(id, comment,  userId)
        return {message: "Your comment has been successfully modified."} 
    }

    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Delete("/deleteComments/:id")
    async deleteComments(
        @Param("id", new ParseUUIDPipe()) id: string,
        @Req() req: any
    ) {
        const userId = req.user.sub
        await this.service.commentDeleteService(id, userId)
        return {message: "Comment successfully deleted."} 
    }

    // Views
    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post("/view/:id")
    async createView(
        @Param("id", new ParseUUIDPipe()) idPins: string,
        @Req() req: any
    ){
        const idUser = req.user.sub
        return this.service.viewService(idUser, idPins)
    }
    
    // Saves (user's saved pins)
     //* Ok
    @Get("/save/:id")
    async getSavePins(
        @Param("id", new ParseUUIDPipe()) idUser: string
    ){
        return await this.service.getSaveService( idUser)
       
    }

    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post("/createSave/:id")
    async savePins(
        @Param("id", new ParseUUIDPipe()) idPins: string,
        @Req() req
    ){
        const idUser = req.user.sub
        return await this.service.saveService(idPins, idUser)
    }

    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Delete("/saveDelete/:id")
    async deleteSavePins( @Param("id", new ParseUUIDPipe()) id: string, @Req() req){
        const idUser = req.user.sub
        await this.service.deleteSave(id, idUser)
        return {message: "This item was removed successfully."}
    }

}