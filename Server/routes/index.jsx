const TARGET_URL = "https://CoderAngelPro.github.io/CubyBot";

export const handler = {
  GET() {
    return Response.redirect(TARGET_URL, 302);
  },
  HEAD() {
    return Response.redirect(TARGET_URL, 302);
  },
};
