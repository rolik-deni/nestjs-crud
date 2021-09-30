import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<User>,
  ) {
    this.insertValuesIfDBEmpty();
  }

  async insertValuesIfDBEmpty() {
    const result = await this.usersRepository.findAndCount();
    if (result[1] === 0) {
      this.usersRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values([
          {
            name: 'Mr. Orange',
            email: 'orange@mail.com',
            password: 'password.orange',
            createdAt: '2021-09-27 20:25:08.053683',
          },
          {
            name: 'Mr. Blue',
            email: 'blue@mail.com',
            password: 'password.blue',
            createdAt: '2021-09-27 20:26:34.105092',
          },
          {
            name: 'Mr. Green',
            email: 'green@mail.com',
            password: 'password.green',
            createdAt: '2021-09-27 20:27:25.191937',
          },
          {
            name: 'Mr. Grey',
            email: 'grey@mail.com',
            password: 'password.grey',
            createdAt: '2021-09-27 20:27:25.19634',
          },
        ])
        .execute();
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
      createUserDto.createdAt,
      createUserDto.removedAt,
    );
    const result = await this.usersRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([user])
      .execute()
      .catch(() => {
        throw new BadRequestException(
          `Пользователь ${createUserDto.name} не добавлен`,
        );
      });

    const id = result['raw'][0]['id'];
    return this.findOneById(id);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (user) {
      return user;
    } else {
      throw new NotFoundException(`Пользователь с id=${id} не найден`);
    }
  }

  async findByName(userName: string): Promise<User[]> {
    const users = await this.usersRepository.find({
      // where: { name: userName },
      name: ILike(`%${userName}%`),
    });

    if (users.length > 0) {
      return users;
    } else {
      throw new NotFoundException(
        `Пользователи с именем ${userName} не найдены`,
      );
    }
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const result = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({
        name: updateUserDto.name,
        email: updateUserDto.email,
        password: updateUserDto.password,
        createdAt: updateUserDto.createdAt,
        removedAt: updateUserDto.removedAt,
      })
      .where('id = :id', { id: userId })
      .execute()
      .catch(() => {
        throw new BadRequestException(
          `Информация пользователя c id=${userId} не обновлена.`,
        );
      });

    if (result['affected'] > 0) {
      return this.findOneById(userId);
    } else {
      throw new BadRequestException(
        `Информация пользователя c id=${userId} не обновлена.`,
      );
    }
  }

  async removeSoft(userId: number) {
    const result = await this.usersRepository.softDelete({ id: userId });
    if (result['affected'] > 0) {
      return { id: userId };
    } else {
      throw new BadRequestException(
        `Информация пользователя c id=${userId} не удалена. Пользователь не найден.`,
      );
    }
  }
}
