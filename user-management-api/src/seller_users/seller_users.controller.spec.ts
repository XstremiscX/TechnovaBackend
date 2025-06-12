import { Test, TestingModule } from '@nestjs/testing';
import { SellerUsersController } from './seller_users.controller';
import { SellerUsersService } from './seller_users.service';

describe('SellerUsersController', () => {
  let controller: SellerUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerUsersController],
      providers: [SellerUsersService],
    }).compile();

    controller = module.get<SellerUsersController>(SellerUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
