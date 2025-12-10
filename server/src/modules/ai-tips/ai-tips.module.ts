import { Module } from '@nestjs/common';
import { AiTipsService } from './ai-tips.service';
import { AiTipsController } from './ai-tips.controller';

@Module({
  controllers: [AiTipsController],
  providers: [AiTipsService],
})
export class AiTipsModule {}