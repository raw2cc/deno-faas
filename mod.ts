import {serve} from "https://deno.land/std@0.77.0/http/server.ts";
import {config} from "https://deno.land/x/dotenv@v1.0.1/mod.ts";
import {Controller} from "./controller.ts";

const flag = config({});

const server = serve({hostname: "0.0.0.0", port: +flag['port']});
const controller = new Controller(flag['remote']);

console.log(`Deno function running. Access it at:  http://localhost:${flag['port']}/`);

for await (const request of server) {
    try{
        const base = request.headers.get('host') ?? "http://0.0.0.0/";
        const path = new URL(request.url, base).pathname;
        controller.call(path, request).then(()=>{
            console.log(path)
        })
    }catch(e){
        console.error("handle request error!")
    }

}
