import { IsEmail, IsString } from 'class-validator';
export class AuthSchema{

    @IsEmail()
    email:string;

    @IsString()
    password:string;
}


