import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getAllUsers() {
        return this.usersService.findAll();
    }

    @Post()
    register(@Body() body: { email: string; password: string; fullName: string; role?: string }) {
        return this.usersService.register(body);
    }

    @Post('login')
    login(@Body() body: { email: string; password: string }) {
        return this.usersService.login(body.email, body.password);
    }
}
