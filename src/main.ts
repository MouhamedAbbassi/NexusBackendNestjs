import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import NestExpressApplication
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..','src','images'),{
    prefix:'/uploads/',
    extensions:['jpg', 'png','jpeg','pdf'],
  });
  await app.listen(3000);
}
bootstrap();
