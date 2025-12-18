import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { DemoModeGuard } from './demo.guard';

@Module({
  controllers: [DemoController],
  providers: [DemoService, DemoModeGuard],
  exports: [DemoService],
})
export class DemoModule {}
