import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TipBattlesService } from './tip-battles.service';

@Controller('api/battles')
export class TipBattlesController {
  constructor(private readonly svc: TipBattlesService) {}

  @Post()
  async create(@Body() body: { merchant_id: string; duration_min: number; type?: 'solo' | 'team' | 'royale' }) {
    return this.svc.createBattle({
      merchant_id: body.merchant_id,
      duration_min: body.duration_min,
      type: body.type ?? 'solo',
    });
  }

  @Post(':battleId/join')
  async join(@Param('battleId') battleId: string, @Body() body: { user_id: string }) {
    return this.svc.joinBattle(battleId, body.user_id);
  }

  @Post(':battleId/tip')
  async tip(@Param('battleId') battleId: string, @Body() body: { user_id: string; amount: number }) {
    await this.svc.applyTip(battleId, body.user_id, body.amount);
    return { ok: true };
  }

  @Get(':battleId/leaderboard')
  async leaderboard(@Param('battleId') battleId: string) {
    const items = await this.svc.leaderboard(battleId);
    return { battle_id: battleId, leaderboard: items };
  }
}

// ---