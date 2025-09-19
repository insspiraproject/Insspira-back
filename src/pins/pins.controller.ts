import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { PinsService } from "./pins.service";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { CommentDto } from "./pinsDtos/comments.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags, ApiBody, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";

@ApiTags('Pins')
@Controller("pins")
export class PinsController {
    constructor(private readonly service: PinsService){}

    // Public search
    //* Ok
    @Get("/search")
    @ApiOperation({ summary: 'Buscar pines por término de consulta' })
    @ApiQuery({ name: 'q', required: true, description: 'Término de búsqueda' })
    @ApiBody({})
    async searchPins(@Query("q") query: string){
        return await this.service.serviceSearch(query)
    }

    // Public list / get
    //* Ok
    @Get()
    @ApiOperation({ summary: 'Obtener lista paginada de todos los pines' })
    @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
    @ApiQuery({ name: 'limit', required: false, description: 'Cantidad de resultados por página', example: 20 })
    async getAllPins(@Query("page") page: number = 1, @Query("limit") limit: number = 20){
        return await this.service.getPinsService(page, limit)
    }

    @Get("/:id")
    @ApiOperation({ summary: 'Obtener un pin por su ID' })
    @ApiParam({ name: 'id', description: 'ID del pin', type: 'string', example: 'a3e1f2d4-5b6c-7d8e-9f01-234567890abc' })
    async getPins(@Param("id", new ParseUUIDPipe()) id:string){
        return await this.service.getPinsIdService(id)
    }

    // Create pin (auth required)
    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post()
    @ApiOperation({ summary: 'Crear un nuevo pin (requiere autenticación)' })
    @ApiBody({ type: pinsDto })
    @HttpCode(HttpStatus.CREATED)
    async createPins(@Body() dtoPin: pinsDto, @Req() req: any){
        const idUser = req.user.sub
        return await this.service.postPinsService(dtoPin, idUser)
    }

    // Update pin (auth required) - hashtags via query (array)
    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Put("/:id")
    @ApiOperation({ summary: 'Actualizar un pin (parcial) y sus hashtags (requiere autenticación)' })
    @ApiParam({ name: 'id', description: 'ID del pin a actualizar', type: 'string' })
    @ApiBody({ type: updateDto })
    async modifiePins(
        @Param("id", new ParseUUIDPipe()) pinId: string,
        @Body("hashtags") hashtags: { id: string; tag: string }[],
        @Body() dtoPin:updateDto,
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
    @ApiOperation({ summary: 'Eliminar un pin (requiere autenticación)' })
    @ApiParam({ name: 'id', description: 'ID del pin a eliminar', type: 'string' })
    async deletePins(@Param("id", new ParseUUIDPipe()) id:string, @Req() req: any){
        const userId = req.user.sub
        await this.service.deletePinsService(id, userId)
        return {message: "Post successfully deleted."}
    }


    // Create Like ) 
    //*OK
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post("/like/:id")
    @ApiOperation({ summary: 'Agregar un like a un pin (requiere autenticación)' })
    @ApiParam({ name: 'id', description: 'ID del pin a dar like', type: 'string' })
    async createLikes(@Param("id", new ParseUUIDPipe()) idPin:string, @Req() req: any){
        const idUser = req.user.sub
        await this.service.likeService(idPin, idUser)
        return {message: "Like added."} 
    }

    //*OK
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Delete("/like/:deleteLike")
    @ApiOperation({ summary: 'Eliminar un like de un pin (requiere autenticación)' })
    @ApiParam({ name: 'deleteLike', description: 'ID del like a eliminar', type: 'string' })
    async deleteLikes(@Param("deleteLike", new ParseUUIDPipe())  id:string, @Req() req: any){
        const userId = req.user.sub
        await this.service.likeDeleteService(id, userId)
        return {message:"Like removed."}
    }

    // Comments
    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post("/comments/:id")
    @ApiOperation({ summary: 'Crear un comentario en un pin (requiere autenticación)' })
    @ApiParam({ name: 'id', description: 'ID del pin', type: 'string' })
    @ApiBody({ type: CommentDto })
    async createComments(@Param("id", new ParseUUIDPipe()) pinId:string, @Body() comment: CommentDto, @Req() req: any) {
        const userId = req.user.sub
        return await this.service.commentService(userId, pinId, comment)
    }

    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Put("/modifiComments/:id")
    @ApiOperation({ summary: 'Modificar un comentario (requiere autenticación)' })
    @ApiParam({ name: 'id', description: 'ID del comentario', type: 'string' })
    @ApiBody({ type: CommentDto })
    async modifiComments(@Param("id", new ParseUUIDPipe()) id:string, @Body()  comment: CommentDto, @Req() req: any){
        const userId = req.user.sub
        await this.service.commentModifieService(id, comment,  userId)
        return {message: "Your comment has been successfully modified."} 
    }

    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Delete("/deleteComments/:id")
    @ApiOperation({ summary: 'Eliminar un comentario (requiere autenticación)' })
    @ApiParam({ name: 'id', description: 'ID del comentario', type: 'string' })
    async deleteComments(@Param("id", new ParseUUIDPipe()) id: string, @Req() req: any) {
        const userId = req.user.sub
        await this.service.commentDeleteService(id, userId)
        return {message: "Comment successfully deleted."} 
    }

    // Views
    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post("/view/:id")
    @ApiOperation({ summary: 'Registrar una vista en un pin (requiere autenticación)' })
    @ApiParam({ name: 'id', description: 'ID del pin visto', type: 'string' })
    async createView(@Param("id", new ParseUUIDPipe()) idPins: string, @Req() req: any){
        const idUser = req.user.sub
        return this.service.viewService(idUser, idPins)
    }
    
    // Saves (user's saved pins)
    //* Ok
    @Get("/save/:id")
    @ApiOperation({ summary: 'Obtener los pins guardados de un usuario' })
    @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string' })
    async getSavePins(@Param("id", new ParseUUIDPipe()) idUser: string){
        return await this.service.getSaveService(idUser)
    }

    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Post("/createSave/:id")
    @ApiOperation({ summary: 'Guardar un pin en favoritos (requiere autenticación)' })
    @ApiParam({ name: 'id', description: 'ID del pin a guardar', type: 'string' })
    async savePins(@Param("id", new ParseUUIDPipe()) idPins: string, @Req() req){
        const idUser = req.user.sub
        return await this.service.saveService(idPins, idUser)
    }

    //* Ok
    @UseGuards(AuthGuard(["local-jwt", "jwt"]))
    @Delete("/saveDelete/:id")
    @ApiOperation({ summary: 'Eliminar un pin guardado (requiere autenticación)' })
    @ApiParam({ name: 'id', description: 'ID del pin guardado', type: 'string' })
    async deleteSavePins(@Param("id", new ParseUUIDPipe()) id: string, @Req() req){
        const idUser = req.user.sub
        await this.service.deleteSave(id, idUser)
        return {message: "This item was removed successfully."}
    }
}
