const Router = require('koa-router');
const router = new Router();
const exampleAPI = require('./src/resources/example');
const authAPI = require('./src/resources/auth')
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

router.post('/register', async (ctx) => {
    try {
        const userData = ctx.request.body;
        const userInfo = await authAPI.registerUser(userData);
        ctx.status = 201;
        ctx.body = {
            userData: userInfo.user,
            token: userInfo.token
        };
    } catch (error) {
        ctx.status = 400;
        ctx.body = {error: error.message};
    }
});

module.exports = router;