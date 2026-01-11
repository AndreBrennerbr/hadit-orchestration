import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';

describe('AuthGuard', () => {
  const createExecutionContext = (
    headers: Record<string, any>,
  ): ExecutionContext => {
    const request: any = { headers };

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;
  };

  it('should be defined', () => {
    const jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as JwtService;

    expect(new AuthGuard(jwtService)).toBeDefined();
  });

  it('throws UnauthorizedException when no token is provided', async () => {
    const jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as JwtService;
    const guard = new AuthGuard(jwtService);
    const context = createExecutionContext({});

    await expect(guard.canActivate(context)).rejects.toMatchObject({
      name: UnauthorizedException.name,
      message: 'No token provided',
    });
  });

  it('throws UnauthorizedException when token is invalid', async () => {
    const jwtService = {
      verifyAsync: jest.fn().mockRejectedValue(new Error('bad token')),
    } as unknown as JwtService;
    const guard = new AuthGuard(jwtService);
    const context = createExecutionContext({ authorization: 'Bearer invalid' });

    await expect(guard.canActivate(context)).rejects.toMatchObject({
      name: UnauthorizedException.name,
      message: 'Invalid or expired token',
    });
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('invalid');
  });

  it('returns true and assigns request.user for valid token', async () => {
    const payload = { sub: 1, username: 'Andre' };
    const jwtService = {
      verifyAsync: jest.fn().mockResolvedValue(payload),
    } as unknown as JwtService;
    const guard = new AuthGuard(jwtService);
    const context = createExecutionContext({ authorization: 'Bearer good' });

    await expect(guard.canActivate(context)).resolves.toBe(true);

    const request = context.switchToHttp().getRequest() as any;
    expect(request.user).toEqual(payload);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith('good');
  });
});
