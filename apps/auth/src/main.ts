/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { RabbitmqService } from '@app/common';
import { AuthServiceModule } from './auth.module';
import { AUTH_SERVICE } from './constants/service';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.useGlobalPipes(new ValidationPipe());

  const rmqService = app.get<RabbitmqService>(RabbitmqService);
  app.connectMicroservice(rmqService.getOptions(AUTH_SERVICE, true));
  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3001;
  await app.listen(port, () => {
    console.log(`The auth service is listening on port ${port}`);
  });
}
bootstrap();
