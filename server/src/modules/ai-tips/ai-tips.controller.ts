import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AiTipsService } from './ai-tips.service';

@Controller('api/ai')
export class AiTipsController {
  constructor(private readonly svc: AiTipsService) {}

  @Post('recommend-tip')
  @HttpCode(HttpStatus.OK)
  async recommend(@Body() body: {
    transaction_amount: number;
    historical_tips?: number[];
    service_quality?: number;
    time_of_day?: number;
  }) {
    const res = this.svc.recommend({
      transaction_amount: body.transaction_amount,
      historical_tips: body.historical_tips ?? [],
      service_quality: body.service_quality,
      time_of_day: body.time_of_day,
    });
    return res;
  }
}

---