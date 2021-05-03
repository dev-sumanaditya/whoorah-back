import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { FastifyRequest } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: FastifyRequest): { status: number; timestamp: string } {
    return {
      status: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
