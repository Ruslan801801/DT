import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DemoModeGuard implements CanActivate {
  canActivate(_ctx: ExecutionContext): boolean {
    const v = (process.env.DEMO_MODE || '').toLowerCase();
    const enabled = v === '1' || v === 'true' || v === 'yes';
    if (!enabled) throw new NotFoundException(); // скрываем наличие demo
    return true;
  }
}
