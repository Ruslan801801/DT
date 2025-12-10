import { Module } from '@nestjs/common';
import { EcashService } from './ecash.service';

@Module({
  providers: [EcashService],
  exports: [EcashService],
})
export class EcashModule {}