import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RequestWithUid } from './_types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/dashboard')
  @UseGuards(AuthGuard)
  async auth(@Req() req: RequestWithUid) {
    try {
      const { uid } = req.body;
      if (!uid) {
        throw new HttpException('UID not found', HttpStatus.BAD_REQUEST);
      }
      const user = await this.authService.getUser(uid);
      if (!user) {
        throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
      }
      const { role } = user;
      return await this.authService.setAuthClaim(uid, role);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }
      throw new HttpException(
        {
          error: err,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
