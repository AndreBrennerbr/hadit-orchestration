import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { userConstants } from './constants';
import { UserResponseDto } from './dto/userResponseDto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(userData: Partial<UserEntity>): Promise<UserResponseDto | null> {
    userData.createdAt = userData.updatedAt = new Date();
    if (!userData.password) {
      throw new BadRequestException('Password is required');
    }

    if (await this.findOne(userData.email!)) {
      throw new ConflictException('User with this email already exists');
    }

    userData.password = await bcrypt.hash(
      userData.password,
      userConstants.saltOrRounds,
    );

    const savedUser = await this.usersRepository.save(userData);
    const { password, role, ...user } = savedUser;

    return user;
  }

  async update(
    id: number,
    updateData: Partial<UserEntity>,
  ): Promise<UserResponseDto> {
    updateData.updatedAt = new Date();
    if (!updateData.password) {
      throw new BadRequestException('Password is required');
    }
    updateData.password = await bcrypt.hash(
      updateData.password,
      userConstants.saltOrRounds,
    );
    await this.usersRepository.update(id, updateData);
    const updatedUser = await this.usersRepository.findOneBy({ id });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const { password, role, ...user } = updatedUser;

    return user;
  }

  async findOne(email: string): Promise<UserEntity | null> {
    return await this.usersRepository.findOneBy({ email });
  }
}
