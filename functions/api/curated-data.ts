interface Env {
  CURATED_KV: KVNamespace;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { status: 204, headers: corsHeaders });
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const area = url.searchParams.get('area');

  if (area) {
    const value = await env.CURATED_KV.get(`area:${area}`, 'json');
    return json(value ?? null);
  }

  // Return all areas
  const list = await env.CURATED_KV.list({ prefix: 'area:' });
  const result: Record<string, unknown> = {};
  for (const key of list.keys) {
    const areaId = key.name.replace('area:', '');
    result[areaId] = await env.CURATED_KV.get(key.name, 'json');
  }
  return json(result);
};

export const onRequestPut: PagesFunction<Env> = async ({ request, env }) => {
  const body = await request.json<{ areaId: string; restaurants: unknown[] }>();
  if (!body.areaId || !Array.isArray(body.restaurants)) {
    return json({ error: 'areaId and restaurants[] required' }, 400);
  }

  await env.CURATED_KV.put(
    `area:${body.areaId}`,
    JSON.stringify(body.restaurants),
  );
  return json({ ok: true });
};
