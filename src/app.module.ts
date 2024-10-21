import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RepositoriesModule } from './repo/repo.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Env } from './lib/env.config';
import { redisStore } from 'cache-manager-redis-yet';
import { TransferModule } from './transfer/transfer.module';
import { LibrariesModule } from './lib/lib';

@Module({
  imports: [
    LibrariesModule,
    CacheModule.registerAsync({
      useFactory: async () => {
        return {
          isGlobal: true,
          store: await redisStore({
            url: Env.REDIS_URL,
            ttl: 600000,
          }),
        };
      },
      isGlobal: true,
    }),
    UserModule,
    TransferModule,
    RepositoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
