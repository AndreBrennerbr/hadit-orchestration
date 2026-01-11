import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const usersServiceMock = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<UsersService>;

    const jwtServiceMock = {
      signAsync: jest.fn(),
    } as unknown as jest.Mocked<JwtService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('throws UnauthorizedException when user is not found', async () => {
    usersService.findOne.mockResolvedValue(null);

    await expect(
      service.singIn('missing@example.com', 'pw'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(usersService.findOne).toHaveBeenCalledWith('missing@example.com');
  });

  it('throws UnauthorizedException when password does not match', async () => {
    usersService.findOne.mockResolvedValue({
      id: 1,
      name: 'Andre',
      email: 'andre@example.com',
      password: 'hashed',
    } as any);

    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(false);

    await expect(
      service.singIn('andre@example.com', 'wrong'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(bcrypt.compare).toHaveBeenCalledWith('wrong', 'hashed');
  });

  it('returns access_token when credentials are valid', async () => {
    usersService.findOne.mockResolvedValue({
      id: 7,
      name: 'Andre',
      email: 'andre@example.com',
      password: 'hashed',
    } as any);
    (bcrypt.compare as unknown as jest.Mock).mockResolvedValue(true);
    jwtService.signAsync.mockResolvedValue('token-123');

    await expect(service.singIn('andre@example.com', 'pw')).resolves.toEqual({
      access_token: 'token-123',
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 7,
      username: 'Andre',
    });
  });
});
