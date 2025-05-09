import { NestFactory } from '@nestjs/core';
import { BookingServiceModule } from './booking-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingServiceModule);
  await app.listen(process.env.port ?? 3001, () => {
    console.log('The booking service is listening on port 3001');
  });
}
bootstrap();
