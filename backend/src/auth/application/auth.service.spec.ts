import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn(() => ({})),
}));

jest.mock('@nestjs/swagger', () => ({
  ApiProperty: jest.fn(() => () => {}),
  ApiPropertyOptional: jest.fn(() => () => {}),
}));

import { AuthService } from './auth.service';
import { UsersService } from '../../users/users.service';
import { MailService } from '../infrastructure/mail.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: any;
  let mailService: any;

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      verifyCredentials: jest.fn(),
      createSession: jest.fn().mockReturnValue({ access_token: 'token', refresh_token: 'refresh' }),
      findByEmail: jest.fn(),
      saveResetToken: jest.fn(),
      findByResetToken: jest.fn(),
      hashPassword: jest.fn(),
      resetPassword: jest.fn(),
    };

    const mockMailService = {
      sendPasswordResetEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register should create user and return tokens', async () => {
    const dto = { email: 'test@test.com', password: '123', fullName: 'Test' };
    usersService.create.mockResolvedValue({ id: '1', ...dto });
    const result = await service.register(dto);
    expect(result.message).toBe('Đăng ký thành công');
    expect(result.access_token).toBeDefined();
    expect(usersService.create).toHaveBeenCalledWith(dto);
  });

  it('login should verify credentials and return tokens', async () => {
    const dto = { email: 'test@test.com', password: '123' };
    usersService.verifyCredentials.mockResolvedValue({ id: '1', ...dto });
    const result = await service.login(dto);
    expect(result.message).toBe('Đăng nhập thành công');
    expect(result.access_token).toBeDefined();
  });
});
