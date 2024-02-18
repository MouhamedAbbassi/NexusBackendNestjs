import { Test, TestingModule } from '@nestjs/testing';
import { MembresController } from './membres.controller';

describe('MembresController', () => {
  let controller: MembresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembresController],
    }).compile();

    controller = module.get<MembresController>(MembresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
