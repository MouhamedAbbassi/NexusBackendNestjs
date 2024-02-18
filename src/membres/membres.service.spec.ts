import { Test, TestingModule } from '@nestjs/testing';
import { MembresService } from './membres.service';

describe('MembresService', () => {
  let service: MembresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembresService],
    }).compile();

    service = module.get<MembresService>(MembresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
