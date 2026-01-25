export const handler = {
  GET() {
    return new Response(
      JSON.stringify({ ok: true, message: "CubyBot API" }),
      {
        headers: { "content-type": "application/json" },
      },
    );
  },
};
