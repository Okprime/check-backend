import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

export const mockUser = {
  email: 'john.doe@email.com',
  firstName: 'John',
  lastName: 'Doe',
  hash: '23r14t35',
  salt: 'ufg3u24ou34',
  countryCode: '+1',
  phoneNumber: '7000355303',
} as any;

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user and return a token', async () => {
      const result = {
        id: 'string',
        firstName: 'string',
        lastName: 'string',
        email: 'string',
        createdAt: 'string',
        updatedAt: 'string',
      };

      jest
        .spyOn(service, 'getUserById')
        .mockImplementation(async () => result as any);

      jest.enableAutomock();

      expect(await controller.getUser(mockUser)).toEqual(result);
    });
  });
});
