import { Body, Controller, Get } from '@nestjs/common';
import { NotFoundException, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { DemoService } from './demo.service';
import { DevLoginDto } from './dto/dev-login.dto';
import { CreateDemoTipDto } from './dto/create-demo-tip.dto';

@ApiTags('demo')
@Controller('demo')
export class DemoController {
  constructor(private readonly demo: DemoService) {}

  private ensureNotProd() {
    const env = process.env.NODE_ENV || 'development';
    if (env === 'production') throw new NotFoundException();
  }

  @Post('login')
  @ApiOperation({ summary: 'Dev login (returns demo token)' })
  login(@Body() dto: DevLoginDto) {
    this.ensureNotProd();
    const u = this.demo.login(dto.name);
    return { ok: true, user: { id: u.id, name: u.name }, token: u.token };
  }

  @Post('tip')
  @ApiOperation({ summary: 'Create demo tip (in-memory)' })
  tip(@Body() dto: CreateDemoTipDto) {
    this.ensureNotProd();
    const tip = this.demo.createTip(dto);
    return { ok: true, tip };
  }

  @Get('feed')
  @ApiOperation({ summary: 'Demo feed (last 50)' })
  feed() {
    this.ensureNotProd();
    return { ok: true, items: this.demo.feed() };
  }
}
