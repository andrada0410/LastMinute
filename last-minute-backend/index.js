const bodyparser = require('koa-bodyparser');
const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();
const config = require('./config.json');
const router = require("./router");
const fs = require('fs')
const { connectToDatabase, runMigrations } = require('./src/db');


const port = config.port || 4000;

app.use(bodyparser({jsonLimit:'100mb'}));

app.use(async (ctx, next) => {
  console.log(ctx.method, ctx.url);
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.status || 500;
    ctx.response.body = err.message;
    console.error(err);
  }
});

app.use(cors());




app.use(router.routes())
  .use(router.allowedMethods());
const httpServer = require("http").createServer(app.callback());
httpServer.listen(port, async (error) => {
  if (error) {
    console.log('Error while trying to open server.', error);
    return;
  }
  await connectToDatabase(config.databaseConfig);
  await runMigrations();
  console.log(`Server started on port`, port);
});