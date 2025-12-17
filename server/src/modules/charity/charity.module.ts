import { Module } from '@nestjs/common';
import { CharityService } from './charity.service';
import { CharityController } from './charity.controller';
import { P2POrmService } from '../p2p/p2p.orm.service';

@Module({
  controllers: [CharityController],
  providers: [CharityService, P2POrmService],
})
export class CharityModule {}

// ---