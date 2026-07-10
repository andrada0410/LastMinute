const Router = require('koa-router');
const router = new Router();
const exampleAPI = require('./src/resources/example');
const config = require('./config.json')
const fs = require('fs');
const path = require('node:path');

router.get('/Example', async (ctx, next) => {
    ctx.response.body = await exampleAPI.get();
    ctx.response.status = 200;
});

router.get('/Example/:id', async (ctx, next) => {
    ctx.response.body = await exampleAPI.getById(ctx.params.id);
    ctx.response.status = 200;
});

module.exports = router;