import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  name: string;
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
  @IsNotEmpty({ message: 'Role should not be empty' })
  role: string;
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;
}
