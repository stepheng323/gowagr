import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Env } from './lib/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const port = Env.PORT || 3000;
  Logger.log(`🚀🚀🚀 Application is running on: http://localhost:${port}`);
  await app.listen(port);
}
bootstrap();
