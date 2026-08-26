import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // Đường dẫn API sẽ là: http://localhost:3000/users
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Xử lý request GET /users
    @Get()
    getAllUsers() {
        return this.usersService.findAll();
    }

    // Xử lý request POST /users
    @Post()
    createUser(@Body() body: any) {
        // Lấy dữ liệu Frontend gửi lên (body) và truyền cho Service
        return this.usersService.create(body);
    }
}
