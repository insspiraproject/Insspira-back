// src/users/users.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseUUIDPipe, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PinsService } from '../pins/pins.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Pin } from 'src/pins/entities/pins.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly pinsService: PinsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, type: User, isArray: true })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: User })
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Get(':id/pins')
  @ApiOperation({ summary: "Get user's own pins (paginated)" })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, type: Pin, isArray: true })
  async getUserPins(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return await this.pinsService.getPinsByUserService(id, page, limit);
  }

  @Get(':id/liked-pins')
  @ApiOperation({ summary: "Get pins liked by user (paginated)" })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiResponse({ status: 200, type: Pin, isArray: true })
  async getUserLikedPins(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return await this.pinsService.getLikedPinsService(id, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: User })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: User })
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200 })
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }

  @Patch(':id/profile-picture')
  @ApiOperation({ summary: 'Update profile picture (Cloudinary publicId → URL)' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async uploadProfilePicture(@Param('id') id: string, @Body() body: { publicId: string }) {
    return this.usersService.uploadProfilePicture(id, body.publicId);
  }

  @Get(':id/pins-count')
  @ApiOperation({ summary: "Get user's pins counter" })
  @ApiParam({ name: 'id', format: 'uuid' })
  async getUserPinsCount(@Param('id', ParseUUIDPipe) id: string) {
    return await this.pinsService.getUserPinsCountService(id);
  }
}
