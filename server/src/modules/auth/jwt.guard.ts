import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyAccess } from './jwt.util';

@Injectable()
export class JwtAuthGuard implements CanActivate {
canActivate(context: ExecutionContext): boolean {
const req = context.switchToHttp().getRequest();
const hdr = req.headers['authorization'] as string | undefined;
if (!hdr || !hdr.startsWith('Bearer ')) return false;
const token = hdr.slice('Bearer '.length);
try {
req.user = verifyAccess(token);
return true;
} catch {
return false;
}
}
}