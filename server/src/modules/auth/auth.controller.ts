import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { verify as verifyJwt } from 'jsonwebtoken';

import { IsString, Matches } from 'class-validator';
class LoginDto { @IsString() @Matches(/^\+?\d{10,15}$/) phone!: string; }

@Controller('auth')
export class AuthController {
constructor(private readonly svc: AuthService) {}

@Post('login')
login(@Body() b: LoginDto, @Res() res: Response) {
const { access, refresh } = this.svc.login(b.phone);
const secure = process.env.NODE_ENV === 'production';
res.cookie('rt', refresh, { httpOnly: true, secure, sameSite: 'strict', maxAge: 30*24*3600*1000 });
return res.json({ access });
}

@Post('refresh')
refresh(@Req() req: Request, @Res() res: Response) {
const token = (req.cookies && (req.cookies as any).rt) as string | undefined;
if (!token) return res.status(401).json({ code: 'no_refresh_cookie' });
try {
const payload: any = verifyJwt(token, process.env.JWT_REFRESH_SECRET || 'dev_refresh');
const { access, refresh } = this.svc.login(payload.phone);
const secure = process.env.NODE_ENV === 'production';
res.cookie('rt', refresh, { httpOnly: true, secure, sameSite: 'strict', maxAge: 30*24*3600*1000 });
return res.json({ access });
} catch (e: any) {
return res.status(401).json({ code: 'invalid_refresh', detail: e.message });
}
}

@Get('me')
@UseGuards(JwtAuthGuard)
me(@Req() req: Request) { return { user: (req as any).user }; }
}