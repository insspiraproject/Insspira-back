import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBody, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por su ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID del usuario',
    example: 'a3e2d7d8-8b4c-4c9f-a123-9a1234567890'
  })
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID del usuario a actualizar',
    example: 'a3e2d7d8-8b4c-4c9f-a123-9a1234567890'
  })
  @ApiBody({ type: UpdateUserDto })
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario existente' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'UUID del usuario a eliminar',
    example: 'a3e2d7d8-8b4c-4c9f-a123-9a1234567890'
  })
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
