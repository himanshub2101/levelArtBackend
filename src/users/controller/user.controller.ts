import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { UserService } from "../services/user.services";
import { User } from "src/schemas/user.schema";

@Controller('users')
export class UserController {
    constructor(private userService: UserService ){}
    
    @Post('register')
    async registerUser(@Body() signUpDto: User): Promise<User> {
      return this.userService.register(signUpDto);
    }

    @Get('/')
    async getAllUsers(): Promise<{ success: boolean; users: User[] }> {
      const users = await this.userService.findAllUsers();
      return { success: true, users };
    }

    @Get('/:id')
    async getUserById(@Param('id') id: string): Promise<User> {
        const user = await this.userService.findOneById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Put('/:id')
    async updateUserById(@Param('id') id: string, @Body() updateUserDto: User): Promise<User> {
        const updatedUser = await this.userService.updateUser(id, updateUserDto);
        if (!updatedUser) {
            throw new NotFoundException('User not found');
        }
        return updatedUser;
    }

    @Delete('/:id')
    async deleteUserById(@Param('id') id: string): Promise<{ success: boolean; message?: any }> {
        return this.userService.deleteUser(id);
    }
}
