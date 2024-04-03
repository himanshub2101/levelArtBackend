import { HttpStatus } from "@nestjs/common";

export const successMessage={
    userCreated: { message: 'User created successfully', statusCode: HttpStatus.CREATED },
    userLoggedIn: { message: 'User logged in successfully', statusCode: HttpStatus.OK },
    forgotpasswordMessage: { message: "Link sent successfully", statusCode: HttpStatus.OK },
    deleteUser: { message: 'User deleted successfully', statusCode: HttpStatus.OK },
}

export const errorMessage={
    userAlreadyExists: { message: 'User already exists', statusCode: HttpStatus.BAD_REQUEST },
    passwordMismatch: { message: 'Password and Confirm Password do not match', statusCode: HttpStatus.BAD_REQUEST },
    userNotFound: { message: 'User not found', statusCode: HttpStatus.NOT_FOUND },
    unauthorizedError: { message: 'Invalid credentials', statusCode: HttpStatus.BAD_REQUEST },
}