import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
constructor(private readonly jwt: JwtService) {}
login(phone: string) {
const sub = 'u_' + Buffer.from(phone).toString('hex').slice(0, 12);
const access = this.jwt.sign({ sub, phone }, { secret: process.env.JWT_SECRET || 'dev-secret', expiresIn: process.env.JWT_EXPIRES || '900s' });
const refresh = this.jwt.sign({ sub, phone }, { secret: process.env.JWT_REFRESH_SECRET || 'dev_refresh', expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d' });
return { access, refresh };
}
}