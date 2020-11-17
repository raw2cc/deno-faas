import { ServerRequest } from "https://deno.land/std@0.77.0/http/server.ts";

export function init(data: unknown) {
  console.log(import.meta.url)
  console.log("init");
}

export function call(request: ServerRequest) {
  request.respond({ status: 200, body: "hello test1.ts" });
}
