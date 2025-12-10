import { Body, Controller, Post } from '@nestjs/common';

class ResolveDto { eid!: string; }

@Controller('api/ble')
export class BleController {
@Post('resolve')
resolve(@Body() body: ResolveDto) {
// Mock: return not found unless specific test EID
if (body.eid === 'TEST-EID') return { found: true, candidate: { eid: body.eid, rssi: -55 } };
return { found: false };
}
}