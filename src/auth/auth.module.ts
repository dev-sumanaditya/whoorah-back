import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [FirebaseAdminModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
