// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@Injectable()
export class UsersService {
  private readonly cloudinaryService: CloudinaryService;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    cloudinaryService: CloudinaryService
  ) {this.cloudinaryService = cloudinaryService;}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async updateUser(id: string, updatedUser: Partial<UpdateUserDto>): Promise<User | null> {
    const user = await this.userRepository.preload({
      id,
      ...updatedUser,
    });
    if (!user) {
      return null;
    }
    return this.userRepository.save(user);
  }

  async removeUser(id: string): Promise<void> {
    const user = await this.getUser(id);
    await this.userRepository.remove(user);
  }

  async findByAuth0Id(auth0Id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { auth0Id } });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async uploadProfilePicture(id: string, publicId: string): Promise<User> {
    const user = await this.getUser(id);
    
    const profilePictureUrl = this.cloudinaryService.url(publicId, {
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'face' }, 
        { radius: 'max' },
      ],
    });
    user.profilePicture = profilePictureUrl;
    return this.userRepository.save(user);
  }
}