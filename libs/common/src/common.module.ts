import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [CommonService],
  exports: [CommonService],
  imports: [RabbitmqModule, AuthModule],
})
export class CommonModule {}
