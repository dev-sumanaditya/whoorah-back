import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  firebase: {
    path: process.env.FIREBASE_CONFIG_PATH,
  },
  streamToken: process.env.STREAM_API_KEY,
  streamId: process.env.STREAM_ID,
  host: process.env.HOST,
}));
