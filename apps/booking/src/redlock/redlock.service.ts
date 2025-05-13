import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock, { Lock } from 'redlock';
import { REDIS_CLIENTS } from '../constants/service';

@Injectable()
export class RedlockService implements OnModuleDestroy {
  private readonly redlock: Redlock;
  private readonly redisClients: Redis[];

  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENTS) redisClients: Redis[], // Inject the Redis clients
  ) {
    this.redisClients = redisClients;
    this.redlock = new Redlock(this.redisClients, {
      // Configuration options
      driftFactor: 0.01, // multiplied by lock time to determine the minimum expiration time
      retryCount: 10,
      retryDelay: 500, // time in ms
      retryJitter: 200, // adds 200ms of randomness to retry delay
      automaticExtensionThreshold: 500, // automatically extend locks nearing expiration by this amount in ms.
    });

    this.redlock.on('clientError', (err) => {
      console.error('Redlock client error', err);
    });
  }

  async acquireLock(resource: string, ttl: number): Promise<Lock | null> {
    try {
      const lock = await this.redlock.acquire([resource], ttl);
      return lock;
    } catch (error) {
      console.error(`Failed to acquire lock for resource ${resource}:`, error);
      return null; // Or throw an exception, depending on your error handling strategy
    }
  }

  async releaseLock(lock: Lock): Promise<void> {
    try {
      await lock.release();
    } catch (error) {
      console.error(
        `Failed to release lock for resource ${lock.resources}:`,
        error,
      );
      //  Don't throw here, releasing a lock that might have expired is usually safe.
    }
  }

  onModuleDestroy() {
    this.redlock.quit(); //shut down all redis connections
    this.redisClients.forEach((client) => client.disconnect());
  }
}
