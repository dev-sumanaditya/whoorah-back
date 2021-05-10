import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUid } from './_types';

@Injectable()
export class UploadGuard implements CanActivate {
  constructor(private fireAuth: FirebaseAuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: RequestWithUid = context.switchToHttp().getRequest();
      if (!request.headers['upload-metadata']) {
        return false;
      }

      const [headersToKeep, token] = (request.headers[
        'upload-metadata'
      ] as string).split(',token');
      const decoded = await this.validate(
        Buffer.from(token.trim(), 'base64').toString('ascii'),
      );
      if (!decoded || !decoded.uid) {
        return false;
      }

      request.headers['upload-metadata'] = headersToKeep;
      return true;
    } catch (error) {
      return false;
    }
  }

  private async validate(token: string) {
    return this.fireAuth.verifyIdToken(token);
  }
}
