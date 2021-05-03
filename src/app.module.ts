import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/config';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import * as admin from 'firebase-admin';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply();
  }
}
