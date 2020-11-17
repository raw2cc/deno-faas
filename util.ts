import "https://deno.land/x/fitch@v1.0.0/polyfill.ts";
import { isWindows } from "https://deno.land/std@0.78.0/_util/os.ts";
export async function importUrl(
  url: URL,
): Promise<unknown> {
  if (url.protocol === "file:") {
    if (isWindows) {
      return await import(url.pathname);
    } else {
      return await import(url.pathname);
    }
  } else {
    return await import(url.href);
  }
}

export async function exist(
  base: string,
  path: string,
): Promise<URL | undefined> {
  try {
    const url = new URL(path, base);
    const exist = await fetch(url, { method: "HEAD" });
    if(exist.ok){
      return url;
    }
  } catch (e) {
    console.error(`found ${base} ${path} error`);
    console.error(e);
  }
  return undefined;
}

export async function existWithExt(
  base: string,
  path: string,
  ext: string,
): Promise<URL | undefined> {
  return await exist(base, `${path}.${ext}`);
}

export async function scriptExist(
  base: string,
  path: string,
): Promise<URL | undefined> {
  if (path.endsWith("/")) {
    return await scriptExist(base, `${path}index`);
  } else {
    const ts = await existWithExt(base, path, "ts");
    if (ts) {
      return ts;
    }
    const js = await existWithExt(base, path, "js");
    if (js) {
      return js;
    }
    // const index = scriptExist(base, `${path}/`);
    // if (index) {
    //   return index;
    // }
  }

  return undefined;
}
