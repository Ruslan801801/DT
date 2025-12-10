import { Module } from '@nestjs/common';
import { BleController } from './ble.controller';
@Module({ controllers: [BleController] })
export class BleModule {}