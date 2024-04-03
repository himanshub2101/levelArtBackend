import { Body, Controller, Get, HttpException, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "../services/user.services";
import { User } from "src/schemas/user.schema";

@Controller('users')
export class UserController {
    constructor(private userService: UserService ){}
    
  @Post('/register')

async reisterUser (@Body() User: User): Promise<any>{
const reisterUser = await this.userService.register(User)
return reisterUser
}

}