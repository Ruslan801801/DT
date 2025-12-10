import { Module } from '@nestjs/common';
import { P2PController } from './p2p.controller';
import { P2PService } from './p2p.service';
import { P2POrmService } from './p2p.orm.service';
import { MetricsService } from '../../metrics/metrics.service';

@Module({ controllers: [P2PController], providers: [P2PService, P2POrmService, MetricsService] })
export class P2PModule {}