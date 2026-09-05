import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn(() => ({})),
}));
import { AuthController } from './auth.controller';
import { AuthService } from '../application/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      googleLogin: jest.fn(),
      googleAccessTokenLogin: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register should call authService.register', () => {
    const dto = { email: 'test@example.com', password: 'password', fullName: 'Test' };
    controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('login should call authService.login', () => {
    const dto = { email: 'test@example.com', password: 'password' };
    controller.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});
