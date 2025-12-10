import { Body, Controller, Post } from '@nestjs/common';
import { RiskService } from './risk.service';
import { RiskInput } from './risk.types';

@Controller('api/risk')
export class RiskController {
constructor(private readonly risk: RiskService) {}

@Post('decide')
decide(@Body() body: RiskInput) {
const res = this.risk.decide(body, /shadow=/true);
return res;
}
}