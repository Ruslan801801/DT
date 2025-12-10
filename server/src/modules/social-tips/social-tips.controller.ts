import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { SocialTipsService } from './social-tips.service';
import { CreateSocialTipDto } from './dto/create-social-tip.dto';

@Controller('api/social-tips')
export class SocialTipsController {
  constructor(private readonly svc: SocialTipsService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() dto: CreateSocialTipDto,
    @Headers('Idempotency-Key') key = '',
  ) {
    if (!key) {
      return { code: 'missing_idempotency_key', retryable: false };
    }
    const { reused, tx, tip } = await this.svc.createWithTransaction(dto, key);
    return {
      code: reused ? 'idempotency_reuse' : 'ok',
      tx_id: tx.id,
      tip,
    };
  }

  @Get('history/:receiverId')
  async history(@Param('receiverId') receiverId: string) {
    const tips = await this.svc.getReceiverWall(receiverId);
    return { receiver_id: receiverId, tips };
  }
}

---