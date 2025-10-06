// src/pins/pins.controller.ts
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Pin } from './entities/pins.entity';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { PinsService } from "./pins.service";
import { pinsDto, updateDto } from "./pinsDtos/pins.dto";
import { CommentDto } from "./pinsDtos/comments.dto";
import { AuthGuard } from "@nestjs/passport";
import { PinsGuardPage } from "src/common/guards/guard.pin";
import { CheckLimit } from "src/common/decorators/decorator.pin";
import { ActionType } from "src/pins.enum";
import { LimitInterceptor } from "src/common/interceptors/interceptor.pin";


@ApiTags('Pins')
@Controller('pins')
export class PinsController {

  constructor(private readonly service: PinsService) {}

    // Public search
    @Get('/search')
    @ApiOperation({ summary: 'Search pins by description or hashtag' })
    @ApiQuery({ name: 'q', required: true })
    @ApiOkResponse({ type: Pin, isArray: true })
    async searchPins(@Query('q') query: string) {
      return await this.service.serviceSearch(query);
    }

    // Public list / get
    @Get()
    @ApiOperation({ summary: 'List pins (paginated)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    @ApiOkResponse({ type: Pin, isArray: true })
    async getAllPins(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
      return await this.service.getPinsService(page, limit);
    }

    @Get('/:id')
    @ApiOperation({ summary: 'Get pin by id' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiOkResponse({ type: Pin })
    async getPins(@Param('id', new ParseUUIDPipe()) id: string) {
      return await this.service.getPinsIdService(id);
    }

    // Create pin (auth required)
    //* Ok
    @CheckLimit(ActionType.POST)
    @UseGuards(AuthGuard('jwt'), PinsGuardPage)
    @UseInterceptors(LimitInterceptor)
    @Post()
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Create a pin (auth)' })
    @ApiBody({ type: pinsDto })
    @ApiResponse({ status: 201, description: 'Pin created' })
    @HttpCode(HttpStatus.CREATED)
    async createPins(
        @Body() dtoPin: pinsDto, 
        @Req() req: any 
    ){
        const idUser = req.user.sub
        return await this.service.postPinsService(dtoPin, idUser)
    }

    // Update pin (auth) + hashtags
    @UseGuards(AuthGuard('jwt'))
    @Put('/:id')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Update a pin (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiBody({ type: updateDto })
    async modifiePins(
      @Param('id', new ParseUUIDPipe()) pinId: string,
      @Body('hashtags') hashtags: { id: string; tag: string }[],
      @Body() dtoPin: updateDto,
      @Req() req: any,
    ) {
      const userId = req.user.sub;
      await this.service.putPinsService(userId, dtoPin, pinId, hashtags);
      return { message: 'The post was successfully modified.' };
    }

    // Delete pin (auth)
    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Delete a pin (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    async deletePins(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
      const userId = req.user.sub;
      await this.service.deletePinsService(id, userId);
      return { message: 'Post successfully deleted.' };
    }

    // Create Like  
    //*OK
    @CheckLimit(ActionType.LIKE)
    @UseGuards(AuthGuard("jwt"), PinsGuardPage)
    // @UseInterceptors(LimitInterceptor)
    @Post("/like/:id")
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Create a like (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    async createLikes(
        @Param("id", new ParseUUIDPipe()) idPin:string,
        @Req() req: any
        ){
        const idUser = req.user.sub
        return await this.service.likeService(idPin, idUser)
 
    }


    @UseGuards(AuthGuard("jwt"), PinsGuardPage)
    @Get('/likeStatus/:pinId')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Get a like (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    async getUserLike(
       @Param("pinId", new ParseUUIDPipe()) pinId: string, 
       @Req() req: any  
    ) {
        const userId = req.user.sub
        return await this.service.likeView(userId, pinId)
      
    }


    // Comments
    @Get("/viewComments/:id")
    async  viewComments(
        @Param("id", new ParseUUIDPipe()) pinId:string,
    ) {
        return await this.service.commentViewService( pinId)
    }

    //* Ok
    @CheckLimit(ActionType.COMMENT)
    @UseGuards(AuthGuard("jwt"), PinsGuardPage)
    @UseInterceptors(LimitInterceptor)
    @Post("/comments/:id")
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Create a comment (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiBody({ type: CommentDto })
    async createComments(
        @Param("id", new ParseUUIDPipe()) pinId:string,
        @Body() comment: CommentDto,
        @Req() req: any
    ) {
        const userId = req.user.sub
        return await this.service.commentService(userId, pinId, comment)
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/modifiComments/:id')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Update a comment (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    @ApiBody({ type: CommentDto })
    async modifiComments(
      @Param('id', new ParseUUIDPipe()) id: string,
      @Body() comment: CommentDto,
      @Req() req: any,
    ) {
      const userId = req.user.sub;
      await this.service.commentModifieService(id, comment, userId);
      return { message: 'Your comment has been successfully modified.' };
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/deleteComments/:id')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Delete a comment (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    async deleteComments(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
      const userId = req.user.sub;
      await this.service.commentDeleteService(id, userId);
      return { message: 'Comment successfully deleted.' };
    }

    // Views
    @UseGuards(AuthGuard('jwt'))
    @Post('/view/:id')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Create a view (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    async createView(@Param('id', new ParseUUIDPipe()) idPins: string, @Req() req: any) {
      const idUser = req.user.sub;
      return this.service.viewService(idUser, idPins);
    }

    // Saves
    @Get('/save/:id')
    @ApiOperation({ summary: "Get user's saved pins" })
    @ApiParam({ name: 'id', format: 'uuid' })
    async getSavePins(@Param('id', new ParseUUIDPipe()) idUser: string) {
      return await this.service.getSaveService(idUser);
    }

    //* Ok
    @CheckLimit(ActionType.SAVE)
    @UseGuards(AuthGuard("jwt"), PinsGuardPage)
    @UseInterceptors(LimitInterceptor)
    @Post("/createSave/:id")
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Save pin for user (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    async savePins(
        @Param("id", new ParseUUIDPipe()) idPins: string,
        @Req() req
    ){
        const idUser = req.user.sub
        return await this.service.saveService(idPins, idUser)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/saveDelete/:id')
    @ApiBearerAuth('jwt')
    @ApiOperation({ summary: 'Delete saved pin (auth)' })
    @ApiParam({ name: 'id', format: 'uuid' })
    async deleteSavePins(@Param('id', new ParseUUIDPipe()) id: string, @Req() req) {
      const idUser = req.user.sub;
      await this.service.deleteSave(id, idUser);
      return { message: 'This item was removed successfully.' };
    }
}
