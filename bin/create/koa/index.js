const Koa = require("koa");
const app = new Koa();

app.use((ctx) => {
  ctx.body = "Hello world";
});
app.listen(8080, undefined, undefined, () => {
  console.log("Server turning on : http://localhost:8080");
});
