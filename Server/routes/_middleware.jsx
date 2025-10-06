// Fresh file-based middleware (global)
export const handler = (ctx) => {
  const origin = ctx.req.headers.get("Origin") ?? "";
  const allowed = [
    "https://CoderAngelPro.github.io",
    "https://CoderAngelPro.github.io/CubyBot",
  ];
  const allowOrigin = allowed.find((o) => origin.startsWith(o)) ?? "*";

  if (ctx.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        Vary: "Origin",
      },
    });
  }

  return ctx.next().then((res) => {
    const h = new Headers(res.headers);
    h.set("Access-Control-Allow-Origin", allowOrigin);
    h.set("Vary", "Origin");
    return new Response(res.body, { status: res.status, headers: h });
  });
};
