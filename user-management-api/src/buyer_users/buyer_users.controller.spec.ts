import { Test, TestingModule } from '@nestjs/testing';
import { BuyerUsersController } from './buyer_users.controller';
import { BuyerUsersService } from './buyer_users.service';

describe('BuyerUsersController', () => {
  let controller: BuyerUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyerUsersController],
      providers: [BuyerUsersService],
    }).compile();

    controller = module.get<BuyerUsersController>(BuyerUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
