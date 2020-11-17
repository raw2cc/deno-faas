import { isURL } from "https://deno.land/x/is_url@v1.0.1/mod.ts";
import { exists } from "https://deno.land/std@0.78.0/fs/mod.ts";
import { join,relative } from "https://deno.land/std@0.78.0/path/mod.ts";

export async function exist(
  base: string,
  path: string,
): Promise<string | undefined> {
  try {
    if (isURL(base)) {
      const url = join(base, path);
      const exist = await fetch(url, { method: "HEAD" });
      console.log(url);
      if (exist.ok) {
        return url.toString();
      }
    } else {
      const url = join(base, path);
      const exist = await exists(url);
      if (exist) {
        return new URL(url,import.meta.url).href;
      }
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
): Promise<string | undefined> {
  return await exist(base, `${path}.${ext}`);
}

export async function scriptExist(
  base: string,
  path: string,
): Promise<string | undefined> {
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
