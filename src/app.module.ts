import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/config';
import { StreamModule } from './stream/stream.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
      envFilePath: ['.dev.env', '.env'],
    }),
    FirebaseAdminModule.forRootAsync({
      inject: [appConfig.KEY],
      imports: [ConfigModule],
      useFactory: async (config: ConfigType<typeof appConfig>) => ({
        credential: admin.credential.cert(config.firebase.path),
      }),
    }),

    AuthModule,
    StreamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply();
  }
}
