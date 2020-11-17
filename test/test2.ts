import { ServerRequest } from "https://deno.land/std@0.77.0/http/server.ts";

export function call(request: ServerRequest) {
  request.respond({ status: 200, body: "hello" });
}
