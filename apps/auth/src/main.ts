/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  // const rmqService = app.get<RabbitmqService>(RabbitmqService);
  // app.connectMicroservice(rmqService);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.port ?? 3000, () => {
    console.log('The auth service is listening on port 3000');
  });
}
bootstrap();
