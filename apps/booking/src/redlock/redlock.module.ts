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
        const redisClients: Redis[] = [];
        //  Use at least 3 clients for Redlock (as recommended)
        const redisConfig1 = {
          host: configService.get<string>('REDIS_HOST_1'), // Default to localhost
          port: configService.get<number>('REDIS_PORT_1', 6379), // Default to 6379
        };
        const redisClient1 = new Redis(redisConfig1);
        redisClient1.on('error', (err) => console.error('Redis error:', err));
        redisClients.push(redisClient1);

        // const redisConfig2 = {
        //   host: configService.get<string>('REDIS_HOST_2'), // Default to localhost
        //   port: configService.get<number>('REDIS_PORT_2', 6380), // Default to 6379
        // };
        // const redisClient2 = new Redis(redisConfig2);
        // redisClient2.on('error', (err) => console.error('Redis error:', err));
        // redisClients.push(redisClient2);

        // const redisConfig3 = {
        //   host: configService.get<string>('REDIS_HOST_3'), // Default to localhost
        //   port: configService.get<number>('REDIS_PORT_3', 6381), // Default to 6379
        // };
        // const redisClient3 = new Redis(redisConfig3);
        // redisClient3.on('error', (err) => console.error('Redis error:', err));
        // redisClients.push(redisClient3);

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
