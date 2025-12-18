type AnyObj = Record<string, any>;

/**
 * validateEnv is used by @nestjs/config (ConfigModule.forRoot({ validate }))
 * For CI docs export we allow skipping strict checks via SKIP_ENV_VALIDATION=1
 */
export function validateEnv(config: AnyObj) {
  if (process.env.SKIP_ENV_VALIDATION === '1') return config;

  const required = ['JWT_SECRET'];
  const missing = required.filter((k) => !config[k]);
  if (missing.length) {
    throw new Error('Missing env vars: ' + missing.join(', '));
  }

  // defaults (safe-ish for dev)
  if (!config.PORT) config.PORT = '3000';
  return config;
}
