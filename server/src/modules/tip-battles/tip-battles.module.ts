import { Module } from '@nestjs/common';
import { TipBattlesService } from './tip-battles.service';
import { TipBattlesController } from './tip-battles.controller';
import { MetricsService } from '../../metrics/metrics.service';

@Module({
  controllers: [TipBattlesController],
  providers: [TipBattlesService, MetricsService],
})
export class TipBattlesModule {}

---