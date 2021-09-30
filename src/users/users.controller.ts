import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(new ValidationPipe()) CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @Get()
  find(
    @Query('id')
    id: number,
    @Query('name')
    name: string,
  ) {
    if (!(id || name)) {
      return this.usersService.findAll();
    } else if (id) {
      return this.usersService.findOneById(id);
    } else {
      return this.usersService.findByName(name);
    }
  }

  @Patch()
  update(
    @Query('id') id: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete()
  removeSoft(@Query('id') id: number) {
    return this.usersService.removeSoft(id);
  }
}
