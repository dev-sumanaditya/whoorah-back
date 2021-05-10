import { FirebaseAuthenticationService } from '@aginix/nestjs-firebase-admin';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUid } from './_types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private fireAuth: FirebaseAuthenticationService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUid = context.switchToHttp().getRequest();
    if (!request.headers?.authorization) {
      return false;
    }

    const decoded = await this.validate(request.headers.authorization);
    if (!decoded || !decoded.uid) {
      return false;
    }

    request.body = { ...request.body, uid: decoded.uid };
    return true;
  }

  private async validate(headerVal: string) {
    const [type, token] = headerVal.split(' ');
    if (
      type.toLowerCase() !== 'Bearer'.toLowerCase() ||
      !token ||
      !token.length
    ) {
      return null;
    }

    return this.fireAuth.verifyIdToken(token);
  }
}
