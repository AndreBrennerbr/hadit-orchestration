import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const usersServiceMock = {
      create: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const jwtServiceMock = {
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates create to UsersService.create', async () => {
    usersService.create.mockResolvedValue({
      id: 1,
      name: 'Andre',
      email: 'a@b.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const dto = { name: 'Andre', email: 'a@b.com', password: 'pw' } as any;
    await controller.create(dto);
    expect(usersService.create).toHaveBeenCalledWith(dto);
  });

  it('delegates update to UsersService.update', async () => {
    usersService.update.mockResolvedValue({
      id: 1,
      name: 'Andre',
      email: 'a@b.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const dto = { password: 'new' } as any;
    await controller.update(1, dto);
    expect(usersService.update).toHaveBeenCalledWith(1, dto);
  });
});
