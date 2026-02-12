import { App } from "fresh";

// Fresh app (no static files)
export const app = new App();

// Load file-based routes and middleware from ./routes
app.fsRoutes();

// Export a Deno Deploy-compatible handler
let cachedHandler;

export default {
  fetch(req, info) {
    cachedHandler ??= app.handler();
    return cachedHandler(req, info);
  },
};
