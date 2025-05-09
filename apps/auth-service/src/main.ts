import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.port ?? 3000, () => {
    console.log('The auth service is listening on port 3000');
  });
}
bootstrap();
