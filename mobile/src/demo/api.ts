export type DemoUser = { id: string; name: string; token: string; createdAt?: string };
export type DemoTip = { id: string; from: string; to: string; amount: number; message?: string; createdAt: string };

function join(base: string, path: string) {
  return base.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
}

export async function demoHealth(base: string) {
  const r = await fetch(join(base, 'demo/health'));
  if (!r.ok) throw new Error('demo/health ' + r.status);
  return r.json();
}

export async function demoReset(base: string, seed = true) {
  const r = await fetch(join(base, 'demo/reset?seed=' + (seed ? 'true' : 'false')), { method: 'POST' });
  if (!r.ok) throw new Error('demo/reset ' + r.status);
  return r.json();
}

export async function demoLogin(base: string, name: string): Promise<DemoUser> {
  const r = await fetch(join(base, 'demo/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!r.ok) throw new Error('demo/login ' + r.status);
  return r.json();
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
  if (!r.ok) throw new Error('demo/tip ' + r.status);
  return r.json();
}

export async function demoFeed(base: string): Promise<DemoTip[]> {
  const r = await fetch(join(base, 'demo/feed'));
  if (!r.ok) throw new Error('demo/feed ' + r.status);
  return r.json();
}
