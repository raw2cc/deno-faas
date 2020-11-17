export function init(data) {
  console.log('init');
}


export function call(request) {
  request.respond({ status: 200, body: "hello test1.js" });

}
