import {
  Controller,
  Get,
  HttpException,
  HttpService,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { FastifyReply, FastifyRequest } from 'fastify';
import { UploadGuard } from 'src/auth/upload.guard';
import appConfig from './../config/config';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(
    private streamService: StreamService,
    @Inject(appConfig.KEY) private config: ConfigType<typeof appConfig>,
    private httpService: HttpService,
  ) {}

  @Get('movies')
  async listMovies() {
    return await this.streamService.getMovies();
  }

  @Post('upload')
  @UseGuards(UploadGuard)
  async upload(
    @Req()
    request: FastifyRequest,
    @Res() response: FastifyReply,
  ) {
    try {
      const { headers } = await this.httpService
        .post(
          `https://api.cloudflare.com/client/v4/accounts/${this.config.streamId}/stream/?direct_user=true `,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.config.streamToken}`,
              'Tus-Resumable': '1.0.0',
              'Upload-Length': request.headers['upload-length'],
              'Upload-Metadata': request.headers['upload-metadata'],
            },
          },
        )
        .toPromise();

      const { location } = headers;

      if (!location) {
        throw new HttpException('Header not found', HttpStatus.BAD_REQUEST);
      }

      await this.streamService.saveMovie(headers['stream-media-id']);

      return response
        .code(201)
        .headers({
          'Access-Control-Expose-Headers':
            'Tus-Resumable, Tus-Version, location, Upload-Length, Upload-Offset, Upload-Metadata, Tus-Max-Size, Tus-Extension, Content-Type, Stream-Media-ID',
          'Access-Control-Allow-Origin': '*',
          location,
        })
        .send();
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('webhook')
  async webhook(
    @Req()
    request: FastifyRequest & {
      body: { uid: string; readyToStream: boolean; status: { state: string } };
    },
  ) {
    const { body } = request;

    return await this.streamService.saveMovieStatus(body);
  }
}
