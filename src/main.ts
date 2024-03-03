import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
<<<<<<< HEAD
  const app = await NestFactory.create(AppModule, { cors: true });
=======
  const app = await NestFactory.create(AppModule);
>>>>>>> 11daeca84d700176ee06da93a1be180673f31991
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
<<<<<<< HEAD
=======


>>>>>>> 11daeca84d700176ee06da93a1be180673f31991
