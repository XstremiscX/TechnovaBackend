import { Test, TestingModule } from '@nestjs/testing';
import { BuyerUsersService } from './buyer_users.service';

describe('BuyerUsersService', () => {
  let service: BuyerUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyerUsersService],
    }).compile();

    service = module.get<BuyerUsersService>(BuyerUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
