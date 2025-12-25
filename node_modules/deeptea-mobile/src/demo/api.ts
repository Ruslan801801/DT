export type DemoUser = { id: string; name: string; token: string; createdAt?: string };
export type DemoTip = { id: string; from: string; to: string; amount: number; message?: string; createdAt: string };

function join(base: string, path: string) {
  return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}

async function jsonOrThrow(r: Response, what: string) {
  if (r.ok) return r.json();
  const e: any = new Error(what + ' ' + r.status);
  e.status = r.status;
  try {
    e.body = await r.text();
  } catch (_) {}
  throw e;
}

export async function demoHealth(base: string) {
  const r = await fetch(join(base, 'demo/health'));
  return jsonOrThrow(r, 'demo/health');
}

export async function demoReset(base: string, seed = true) {
  const r = await fetch(join(base, 'demo/reset?seed=' + (seed ? 'true' : 'false')), { method: 'POST' });
  return jsonOrThrow(r, 'demo/reset');
}

export async function demoLogin(base: string, name: string): Promise<DemoUser> {
  const r = await fetch(join(base, 'demo/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return jsonOrThrow(r, 'demo/login');
}

export async function demoTip(base: string, token: string, toName: string, amount: number, message?: string) {
  const r = await fetch(join(base, 'demo/tip'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: JSON.stringify({ toName, amount, message }),
  });
  return jsonOrThrow(r, 'demo/tip');
}

export async function demoFeed(base: string): Promise<DemoTip[]> {
  const r = await fetch(join(base, 'demo/feed'));
  return jsonOrThrow(r, 'demo/feed');
}
