import { Body, Controller, Headers, Post, HttpException, HttpStatus } from '@nestjs/common';
import { createHmac } from 'crypto';

interface PSPWebhookPayload {
payment_id: string;
status: 'success' | 'failed' | 'pending';
amount: number;
currency: string;
user_id?: string;
metadata?: any;
}

@Controller('webhooks')
export class PaymentsController {
private readonly WEBHOOK_SECRET = process.env.PSP_WEBHOOK_SECRET || 'dev-secret';

@Post('psp')
async handlePSPWebhook(
@Body() payload: PSPWebhookPayload,
@Headers('x-signature') signature: string,
@Headers('x-webhook-id') webhookId: string
) {
if (!this.verifySignature(payload, signature)) {
throw new HttpException('Invalid signature', HttpStatus.UNAUTHORIZED);
}
try {
switch(payload.status){
case 'success': await this.onSuccess(payload); break;
case 'failed': await this.onFailed(payload); break;
case 'pending': default: break;
}
return { processed: true, webhookId };
} catch(e:any){
return { processed: false, error: 'Processing failed, will retry' };
}
}

private verifySignature(payload: any, signature: string): boolean {
const expected = createHmac('sha256', this.WEBHOOK_SECRET).update(JSON.stringify(payload)).digest('hex');
return expected === signature;
}

private async onSuccess(p: PSPWebhookPayload){ /* TODO: balance update */ }
private async onFailed(p: PSPWebhookPayload){ /* TODO: notify */ }
}