import { Body, Controller, Get, Headers, Post, Query, UseGuards } from '@nestjs/common';
import { DemoModeGuard } from './demo.guard';
import { DemoService } from './demo.service';

@Controller('demo')
@UseGuards(DemoModeGuard)
export class DemoController {
  constructor(private readonly demo: DemoService) {}

  @Get('health')
  health() {
    return this.demo.health();
  }

  @Post('reset')
  reset(@Query('seed') seed?: string) {
    const doSeed = seed == null ? true : seed !== 'false';
    return this.demo.reset(doSeed);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.demo.login(body && body.name ? String(body.name) : undefined);
  }

  @Post('tip')
  tip(
    @Body() body: any,
    @Headers('authorization') auth?: string,
    @Headers('x-demo-token') xDemoToken?: string,
  ) {
    const bearer = (auth || '').startsWith('Bearer ') ? (auth || '').slice(7) : '';
    const token = xDemoToken || bearer || (body && body.fromToken) || '';
    return this.demo.createTip({
      fromToken: token ? String(token) : undefined,
      toName: String(body && body.toName ? body.toName : 'Someone'),
      amount: Number(body && body.amount ? body.amount : 0),
      message: body && body.message ? String(body.message) : undefined,
    });
  }

  @Get('feed')
  feed() {
    return this.demo.feed();
  }
}
