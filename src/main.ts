import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import fastifyCookie from 'fastify-cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('api');
  app.register(fastifyCookie, {
    secret: '##**1234**##', // for cookies signature
  });
  await app.listen(3000);
}
bootstrap();
