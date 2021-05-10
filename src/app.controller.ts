import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  root(): { status: number; timestamp: string } {
    return {
      status: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    };
  }
}
