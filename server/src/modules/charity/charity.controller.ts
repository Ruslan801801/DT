import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { CharityService } from './charity.service';

@Controller('api/charity')
export class CharityController {
  constructor(private readonly svc: CharityService) {}

  @Get('list')
  async list(
    @Query('location') location?: string,
    @Query('categories') categories?: string,
  ) {
    const cats = categories ? categories.split(',') : undefined;
    const orgs = await this.svc.listCharities(location, cats);
    return orgs;
  }

  @Post('tip')
  @HttpCode(HttpStatus.OK)
  async tip(@Body() body: {
    sender_id: string;
    receiver_eid: string;
    tip_amount: number;
    donation_amount: number;
    charity_id: string;
    message?: string;
    idempotency_key: string;
  }) {
    const res = await this.svc.createCharityTip({
      sender_id: body.sender_id,
      receiver_eid: body.receiver_eid,
      tip_amount: body.tip_amount,
      donation_amount: body.donation_amount,
      charity_id: body.charity_id,
      message: body.message,
      idempotencyKey: body.idempotency_key,
    });
    return res;
  }
}

// ---