import { Body, Controller, Post } from '@nestjs/common';

@Controller('p2p')
export class P2PController {
  @Post('ping')
  ping(@Body() body: any) {
    return { ok: true, echo: body ?? null };
  }
}
