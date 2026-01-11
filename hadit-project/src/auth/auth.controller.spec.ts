import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const authServiceMock = {
      singIn: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('delegates login to AuthService.singIn', async () => {
    authService.singIn.mockResolvedValue({ access_token: 'token' });

    await expect(
      controller.singIn({ email: 'a@b.com', password: 'pw' } as any),
    ).resolves.toEqual({ access_token: 'token' });
    expect(authService.singIn).toHaveBeenCalledWith('a@b.com', 'pw');
  });
});
