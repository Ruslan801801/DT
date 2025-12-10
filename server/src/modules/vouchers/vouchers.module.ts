import { Module } from '@nestjs/common';
import { VouchersController } from './vouchers.controller';
import { VoucherRepository } from './voucher.repository';
import { VoucherService } from './voucher.service';
import { MetricsService } from '../../metrics/metrics.service';

@Module({
controllers: [VouchersController],
providers: [VoucherRepository, VoucherService, MetricsService],
})
export class VouchersModule {}