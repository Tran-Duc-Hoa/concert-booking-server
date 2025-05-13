import { RabbitmqService } from '@app/common';
import { NestFactory } from '@nestjs/core';
import { ConcertModule } from './concert.module';
import { CONCERT_SERVICE } from './constants/services';

async function bootstrap() {
  const app = await NestFactory.create(ConcertModule);

  const rmqService = app.get<RabbitmqService>(RabbitmqService);
  app.connectMicroservice(rmqService.getOptions(CONCERT_SERVICE));
  await app.startAllMicroservices();

  const port = process.env.CONCERT_PORT ?? 3000;
  await app.listen(port, () => {
    console.log(`The concert service is listening on port ${port}`);
  });
}
bootstrap();
