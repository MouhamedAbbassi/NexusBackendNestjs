import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as dotenv from 'dotenv';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.use(cors());
  await app.listen(3000);
}
bootstrap();
