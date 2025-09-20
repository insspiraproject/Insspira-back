import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, ParseUUIDPipe, Query, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { PinsService } from '../pins/pins.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly pinsService: PinsService
  ) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get(':id/pins')
  async getUserPins(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return await this.pinsService.getPinsByUserService(id, page, limit);
  }

  //@UseGuards(AuthGuard(["local-jwt", "jwt"]))
  @Get(':id/liked-pins')
  async getUserLikedPins(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    //@Req() req: any
  ) {
    
    //if (req.user.sub !== id) {
    //  throw new ForbiddenException('You can only see your own liked pins');
    //}
    
    return await this.pinsService.getLikedPinsService(id, page, limit);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }

  @Patch(':id/profile-picture')
  async uploadProfilePicture(
    @Param('id') id: string,
    @Body() body: { publicId: string }, 
  ) {
    return this.usersService.uploadProfilePicture(id, body.publicId);
  }

  @Get(':id/pins-count')
  async getUserPinsCount(@Param('id', ParseUUIDPipe) id: string) {
      return await this.pinsService.getUserPinsCountService(id);
  }
}