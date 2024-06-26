import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../user/user.service';
import { AccountService } from './account.service';
import { AuthService } from '../auth/auth.service';

describe('AccountService', () => {
  let service: AccountService;
  let usersService: UsersService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: UsersService,
          useValue: {
            getUserByUsername: jest.fn(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            handleOTPRequest: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
