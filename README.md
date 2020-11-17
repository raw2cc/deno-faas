# Deno Fass

Deno 的自部署云函数框架

## 快速开始

```shell
git clone https://github.com/raw2cc/deno-faas
cd deno-faas
cp .env.example .env
deno run -A --unstable .\mod.ts
curl http://localhost:3000/test1
```

## 配置

复制 `.env.example` 到 `.env` ，在 `.env` 文件中配置服务器端口及函数获取地址。

如，`remote=https://raw.githubusercontent.com/raw2cc/deno-faas/main/test/` 表示：

我请求 `/test1` 会寻找 `https://raw.githubusercontent.com/raw2cc/deno-faas/main/test/test1.ts` 这个文件，如果能找到，就会把他拉下来然后加载。


## 函数编写

函数文件能有两个函数，一个是 `init` 一个是 `call` ，`init` 只会在加载后调用一次， `call` 会在请求到来时调用。


## 自动重载

每过 10 分钟，服务器会自动重载所有的云函数。

## 函数样例

见 example 文件夹。

## 其他

估计有很多 Bug，欢迎试玩。