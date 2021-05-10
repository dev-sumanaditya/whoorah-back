import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { HttpModule, Module } from '@nestjs/common';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';
@Module({
  imports: [FirebaseAdminModule, HttpModule],
  providers: [StreamService],
  controllers: [StreamController],
})
export class StreamModule {}
