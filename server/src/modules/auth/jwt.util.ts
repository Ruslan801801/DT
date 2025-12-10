import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES = process.env.JWT_EXPIRES || '900s';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '30d';
const ACCESS_SECRET = process.env.JWT_SECRET || 'dev';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh';

export type JwtPayload = { sub: string, phone?: string };

export function signAccess(payload: JwtPayload) {
return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });
}
export function signRefresh(payload: JwtPayload) {
return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });
}
export function verifyAccess(token: string) {
return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
}
export function verifyRefresh(token: string) {
return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
}