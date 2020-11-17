import { serve } from "https://deno.land/std@0.77.0/http/server.ts";
import { config } from "https://deno.land/x/dotenv@v1.0.1/mod.ts";
import { Controller } from "./controller.ts";

config({ export: true });

const port = Deno.env.get("port") ?? "3000";
const remote = Deno.env.get("remote");
const refreshTime = Deno.env.get("refresh_time") ?? 10 * 60;
if (!remote) {
  console.error("Need remote");
  Deno.exit(0);
}
const server = serve({ hostname: "0.0.0.0", port: +port });
const controller = new Controller(remote, +refreshTime);

console.log(`Deno fass running. Access it at:  http://localhost:${+port}/`);

for await (const request of server) {
  try {
    const base = request.headers.get("host") ?? "http://0.0.0.0/";
    const path = new URL(request.url, base).pathname;
    controller.call(path, request).then(() => {
      console.log(path);
    });
  } catch (e) {
    console.error("handle request error!");
  }
}
