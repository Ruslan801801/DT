import { Module, MiddlewareConsumer } from '@nestjs/common';
import { BleModule } from './modules/ble/ble.module';
import { P2PModule } from './modules/p2p/p2p.module';
import { VouchersModule } from './modules/vouchers/vouchers.module';
import { HealthModule } from './modules/health/health.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { AuthModule } from './modules/auth/auth.module';

@Module({
imports: [BleModule, P2PModule, VouchersModule, HealthModule, AuthModule, PaymentsModule],
})
export class AppModule {
configure(consumer: MiddlewareConsumer) {
consumer.apply(RateLimitMiddleware).forRoutes('*');
}
}