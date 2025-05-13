import { NestFactory } from '@nestjs/core';
import { BookingModule } from './booking.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingModule);
  // const rmqService = app.get<RabbitmqService>(RabbitmqService);
  // app.connectMicroservice(rmqService.getOptions(CONCERT_SERVICE));

  // await app.startAllMicroservices();

  const port = process.env.PORT ?? 3002;
  await app.listen(port, () => {
    console.log(`The booking service is listening on port ${port}`);
  });
}
bootstrap();
