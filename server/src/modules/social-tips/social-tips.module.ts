import { Module } from '@nestjs/common';
import { SocialTipsController } from './social-tips.controller';
import { SocialTipsService } from './social-tips.service';
import { P2POrmService } from '../p2p/p2p.orm.service';
import { MetricsService } from '../../metrics/metrics.service';

@Module({
  controllers: [SocialTipsController],
  providers: [SocialTipsService, P2POrmService, MetricsService],
})
export class SocialTipsModule {}

---