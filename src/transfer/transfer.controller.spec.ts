import { Test, TestingModule } from '@nestjs/testing';
import { TransferController } from './transfer.controller';
import { UserService } from '../types/user.service';

describe('TransferController', () => {
  let controller: TransferController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransferController],
      providers: [UserService],
    }).compile();

    controller = module.get<TransferController>(TransferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
