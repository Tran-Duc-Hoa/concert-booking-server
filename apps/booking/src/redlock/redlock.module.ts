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
        const redisHosts = [
          { host: 'REDIS_HOST_1', port: 'REDIS_PORT_1', defaultPort: 6379 },
          { host: 'REDIS_HOST_2', port: 'REDIS_PORT_2', defaultPort: 6379 },
          { host: 'REDIS_HOST_3', port: 'REDIS_PORT_3', defaultPort: 6379 },
        ];

        redisHosts.forEach(({ host, port, defaultPort }) => {
          const redisConfig = {
            host: configService.get<string>(host), // Default to localhost
            port: configService.get<number>(port, defaultPort), // Default to specified port
          };
          const redisClient = new Redis(redisConfig);
          redisClient.on('error', (err) => console.error('Redis error:', err));
          redisClients.push(redisClient);
        });

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
