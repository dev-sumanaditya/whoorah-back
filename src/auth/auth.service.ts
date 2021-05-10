import {
  FirebaseAuthenticationService,
  FirebaseFirestoreService,
} from '@aginix/nestjs-firebase-admin';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private fireAuth: FirebaseAuthenticationService,
    private fireStore: FirebaseFirestoreService,
  ) {}

  async getUserByToken(token: string) {
    try {
      const { uid } = await this.fireAuth.verifyIdToken(token);
      return await this.fireAuth.getUser(uid);
    } catch (error) {
      throw error;
    }
  }

  async setAuthClaim(uid: string, claim: string) {
    try {
      return await this.fireAuth.setCustomUserClaims(uid, { [claim]: true });
    } catch (error) {
      throw error;
    }
  }

  async getUser(uid: string) {
    try {
      return await (
        await this.fireStore.collection('users')?.doc(uid)?.get()
      )?.data();
    } catch (error) {
      throw error;
    }
  }
}
