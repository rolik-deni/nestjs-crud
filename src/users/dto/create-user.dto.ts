import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(1, 32)
  password: string;

  @IsOptional()
  createdAt: string;

  @IsOptional()
  removedAt: string;
}
