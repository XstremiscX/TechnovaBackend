import { ExecutionContext, HttpException } from '@nestjs/common';
import { SellerUsersGuard } from './seller_users.guard';
import { JwtService } from '@nestjs/jwt';

describe('SellerUsersGuard', () => {
  let guard: SellerUsersGuard;
  let mockJwtService: Partial<JwtService>;

  const mockContext = (authorization?: string) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { authorization },
        }),
      }),
    }) as ExecutionContext;

  beforeEach(() => {
    mockJwtService = {
      verifyAsync: jest.fn(),
    };
    guard = new SellerUsersGuard(mockJwtService as JwtService);
  });

  it('debería permitir acceso si el token es válido', async () => {
    (mockJwtService.verifyAsync as jest.Mock).mockResolvedValue({ id: '123' });

    const context = mockContext('valid-token');
    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
      secret: process.env.JWT_SECRET,
    });
  });

  it('debería lanzar una HttpException si no se envía token', async () => {
    const context = mockContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrowError(
      new HttpException('Unauthorized', 401)
    );
  });

  it('debería lanzar HttpException si el token es inválido o expirado', async () => {
    const error = new Error('token no válido');
    error.name = 'JsonWebTokenError';
    (mockJwtService.verifyAsync as jest.Mock).mockRejectedValue(error);

    const context = mockContext('invalid-token');

    await expect(guard.canActivate(context)).rejects.toThrowError(
      new HttpException('Unauthorized', 401)
    );
  });
});
