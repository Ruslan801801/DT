export type CorsProfile = {
origin: (origin: string | undefined, cb: (err: Error | null, allow?: boolean) => void) => void;
credentials: boolean;
methods: string[];
allowedHeaders: string[];
};

const parseOrigins = (env: string | undefined): string[] =>
(env || '').split(',').map(s => s.trim()).filter(Boolean);

export function buildCorsOptions(): CorsProfile {
const whitelist = new Set(parseOrigins(process.env.PROD_ORIGINS));
const isProd = process.env.NODE_ENV === 'production';
return {
origin: (origin, cb) => {
if (!isProd) return cb(null, true);
if (!origin) return cb(null, false);
cb(null, whitelist.has(origin));
},
credentials: true,
methods: ['GET','POST','PUT','DELETE','OPTIONS'],
allowedHeaders: ['Content-Type','Authorization','Idempotency-Key'],
};
}