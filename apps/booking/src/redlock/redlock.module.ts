import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

import { REDIS_CLIENTS } from '../constants/service';
import { RedlockService } from './redlock.service';

// Define the type for the Redis client array
type RedisClients = Redis[];

@Module({})
export class RedlockModule {
  static register(): DynamicModule {
    const redisClientsProvider: Provider = {
      provide: REDIS_CLIENTS,
      useFactory: (configService: ConfigService): RedisClients => {
        const redisConfig = {
          host: configService.get<string>('REDIS_HOST', 'localhost'), // Default to localhost
          port: configService.get<number>('REDIS_PORT', 6379), // Default to 6379
          // You can add more Redis options here, e.g.,
          // password: configService.get<string>('REDIS_PASSWORD'),
          // db: configService.get<number>('REDIS_DB'),
        };

        const redisClients: Redis[] = [];
        //  Use at least 3 clients for Redlock (as recommended)
        for (let i = 0; i < 3; i++) {
          redisClients.push(new Redis(redisConfig));
        }
        return redisClients;
      },
      inject: [ConfigService],
    };

    return {
      module: RedlockModule,
      providers: [redisClientsProvider, RedlockService],
      exports: [RedlockService], // Make RedlockService available for injection
    };
  }
}
