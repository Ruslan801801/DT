import { Body, Controller, Post, Query } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskInput, RiskDecision } from './risk.types';

@Controller('risk')
export class RiskController {
  constructor(private readonly risk: RiskService) {}

  @Post('decide')
  decide(@Body() body: RiskInput, @Query('shadow') shadow?: string): RiskDecision {
    const isShadow = shadow == null ? true : shadow !== 'false';
    return this.risk.decide(body, isShadow);
  }
}
