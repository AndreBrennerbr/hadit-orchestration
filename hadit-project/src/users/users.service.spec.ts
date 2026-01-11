import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { userConstants } from './constants';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: {
    save: jest.Mock;
    update: jest.Mock;
    findOneBy: jest.Mock;
  };

  beforeEach(async () => {
    usersRepository = {
      save: jest.fn(),
      update: jest.fn(),
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USERS_REPOSITORY',
          useValue: usersRepository as unknown as Repository<UserEntity>,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('throws BadRequestException when password is missing', async () => {
      await expect(
        service.create({ name: 'Andre', email: 'a@b.com' } as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws ConflictException when email already exists', async () => {
      usersRepository.findOneBy.mockResolvedValue({ id: 1 } as any);

      await expect(
        service.create({
          name: 'Andre',
          email: 'a@b.com',
          password: 'pw',
        } as any),
      ).rejects.toBeInstanceOf(ConflictException);

      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('hashes password and returns user without password/role', async () => {
      usersRepository.findOneBy.mockResolvedValue(null);
      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashed');

      usersRepository.save.mockImplementation(async (data: any) => ({
        id: 10,
        role: 'admin',
        ...data,
      }));

      const result = await service.create({
        name: 'Andre',
        email: 'a@b.com',
        password: 'pw',
      } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        'pw',
        userConstants.saltOrRounds,
      );
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Andre',
          email: 'a@b.com',
          password: 'hashed',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: 10,
          name: 'Andre',
          email: 'a@b.com',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect((result as any).password).toBeUndefined();
      expect((result as any).role).toBeUndefined();
    });
  });

  describe('update', () => {
    it('throws BadRequestException when password is missing', async () => {
      await expect(
        service.update(1, { name: 'Andre' } as any),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws NotFoundException when user does not exist', async () => {
      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashed');
      usersRepository.update.mockResolvedValue({ affected: 0 } as any);
      usersRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(123, { password: 'pw' } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('hashes password, updates and returns user without password/role', async () => {
      (bcrypt.hash as unknown as jest.Mock).mockResolvedValue('hashed');
      usersRepository.update.mockResolvedValue({ affected: 1 } as any);
      usersRepository.findOneBy.mockResolvedValue({
        id: 5,
        name: 'Andre',
        role: 'admin',
        email: 'a@b.com',
        password: 'hashed',
        createdAt: new Date('2020-01-01T00:00:00.000Z'),
        updatedAt: new Date('2020-01-02T00:00:00.000Z'),
      } as any);

      const result = await service.update(5, { password: 'pw' } as any);

      expect(bcrypt.hash).toHaveBeenCalledWith(
        'pw',
        userConstants.saltOrRounds,
      );
      expect(usersRepository.update).toHaveBeenCalledWith(
        5,
        expect.objectContaining({
          password: 'hashed',
          updatedAt: expect.any(Date),
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          id: 5,
          name: 'Andre',
          email: 'a@b.com',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
      expect((result as any).password).toBeUndefined();
      expect((result as any).role).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('delegates to repository.findOneBy', async () => {
      usersRepository.findOneBy.mockResolvedValue({ id: 1 } as any);

      await expect(service.findOne('a@b.com')).resolves.toEqual({ id: 1 });
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        email: 'a@b.com',
      });
    });
  });
});
