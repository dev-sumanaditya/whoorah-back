import { FirebaseFirestoreService } from '@aginix/nestjs-firebase-admin';
import { HttpService, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import appConfig from './../config/config';

@Injectable()
export class StreamService implements OnModuleInit {
  constructor(
    private fireStore: FirebaseFirestoreService,
    @Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>,
    private httpService: HttpService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.updateWebHook();
    } catch (err) {
      console.error(err);
    }
  }

  async updateWebHook() {
    try {
      await this.httpService
        .put(
          `https://api.cloudflare.com/client/v4/accounts/${this.config.streamId}/stream/webhook`,
          {
            notificationUrl: `${this.config.host}/api/stream/webhook`,
          },
          {
            headers: {
              Authorization: `Bearer ${this.config.streamToken}`,
            },
          },
        )
        .toPromise();
      console.log(`Webhook submitted`);
    } catch (err) {
      console.error(err.response.data);
    }
  }

  async saveMovieStatus(body: {
    uid: string;
    readyToStream: boolean;
    status: { state: string };
  }) {
    const { uid, readyToStream, status } = body;

    return this.fireStore.collection('movies').doc(uid).set(
      {
        readyToStream,
        status,
      },
      { merge: true },
    );
  }
  async getMovies() {
    const moviesRef = await this.fireStore.collection('movies');
    const snapshot = await moviesRef.get();
    return snapshot.docs.map((doc) => doc.data());
  }

  async saveMovie(uid: string) {
    return await this.fireStore
      .collection('movies')
      .doc(uid)
      .set({
        uid,
        pendingUpload: true,
        readyToStream: false,
        status: {
          state: 'pendingUpload',
        },
      });
  }
}
