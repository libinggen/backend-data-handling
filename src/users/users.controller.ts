/* eslint @typescript-eslint/no-explicit-any: 0 */
import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, UsePipes, ValidationPipe, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  //get all users
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  //get user by id
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      return user;
    }
  }

  //create user
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() user: User): Promise<User> {
    try {
      return await this.usersService.create(user);
    } catch (error) {
      if (error.code === '23505') {
        if (error.constraint === 'unique_user_name') {
          throw new HttpException('Username is already taken.', HttpStatus.CONFLICT);
        } else if (error.constraint === 'unique_user_email') {
          throw new HttpException('Email is already taken.', HttpStatus.CONFLICT);
        }
      }

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }


  //update user
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() user: User): Promise<any> {
    try {
      const existingUser = await this.usersService.findOne(id);
      if (!existingUser) {
        throw new NotFoundException('User does not exist!');
      }

      if (
        user.name === existingUser.name &&
        user.email === existingUser.email &&
        user.password === existingUser.password
      ) {
        throw new HttpException('Must be different from the current value.', HttpStatus.BAD_REQUEST);
      }
      return await this.usersService.update(id, user);
    } catch (error) {
      if (error.code === '22P02') {
        throw new HttpException('Invalid UUID.', HttpStatus.CONFLICT);
      }

      if (error.code === '23505') {
        if (error.constraint === 'unique_user_name') {
          throw new HttpException('Username is already taken.', HttpStatus.CONFLICT);
        } else if (error.constraint === 'unique_user_email') {
          throw new HttpException('Email is already taken.', HttpStatus.CONFLICT);
        }
      }

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  //delete user
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(id);
  }
}