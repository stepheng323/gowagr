import { Global, Module } from '@nestjs/common';
import { KyselyService } from '../db/db';
import { Env } from './env.config';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: KyselyService,
      // inject: [SecretsService],
      useFactory: () => {
        return new KyselyService(Env.DATABASE_URL);
      },
    },
  ],
  exports: [KyselyService],
})
export class LibrariesModule {}
