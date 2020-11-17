import { ServerRequest } from "https://deno.land/std@0.77.0/http/server.ts";
import { scriptExist } from "./util.ts";

interface FunctionMoudle {
  init(): Promise<unknown>;
  call(request: ServerRequest): Promise<unknown>;
}

export class Controller {
  remote: string;
  functions: Map<string, FunctionMoudle>;
  refreshId: number;
  index: number;

  constructor(remote: string, refreshTime: number) {
    this.remote = remote;
    this.functions = new Map<string, FunctionMoudle>();
    this.refreshId = 0;
    this.beginRefresh(refreshTime);
    this.index = 0;
  }

  async call(
    filePath: string,
    request: ServerRequest,
  ): Promise<unknown> {
    try {
      const module = await this.find(filePath);
      if (module) {
        return await module.call(request);
      } else {
        request.respond({ status: 404, body: "no found" });
        return undefined;
      }
    } catch (e) {
      request.respond({ status: 500, body: "error" });
      console.error(e);
    }
  }

  async load(
    filePath: string,
    functions: Map<string, FunctionMoudle> = this.functions,
  ): Promise<FunctionMoudle | undefined> {
    const truePath = await scriptExist(this.remote, filePath);
    let module = undefined;
    try {
      if (functions.has(filePath)) {
        functions.delete(filePath);
      }
      if (truePath) {
        module = await import(truePath) as FunctionMoudle;
        if (!module.call) {
          module = undefined;
        } else if (module.init) {
          module.init();
          functions.set(filePath, module);
        }
      }
    } catch (e) {
      console.error(e);
    }

    return module;
  }

  async find(filePath: string): Promise<FunctionMoudle | undefined> {
    if (this.functions.has(filePath)) {
      return this.functions.get(filePath);
    } else {
      return await this.load(filePath);
    }
  }

  async refresh() {
    const functions = new Map<string, FunctionMoudle>();
    for (const filePath of this.functions.keys()) {
      await this.load(filePath, functions);
    }
    this.functions.clear();
    this.functions = functions;
  }

  stopRefresh() {
    if (this.refreshId > 0) {
      clearInterval(this.refreshId);
      this.refreshId = 0;
    }
  }

  beginRefresh(refreshTime: number) {
    if (this.refreshId == 0) {
      if (refreshTime > 60) {
        this.refreshId = setInterval(
          this.refresh.bind(this),
          refreshTime * 1000,
        );
      }
    }
  }
}
