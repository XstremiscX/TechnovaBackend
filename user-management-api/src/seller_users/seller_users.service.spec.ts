import { Test, TestingModule } from '@nestjs/testing';
import { SellerUsersService } from './seller_users.service';

describe('SellerUsersService', () => {
  let service: SellerUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerUsersService],
    }).compile();

    service = module.get<SellerUsersService>(SellerUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
