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
        const userNetworkInput = ctx.request.body;
        const dbUserInfo = await authAPI.registerUser(userNetworkInput);

        ctx.status = 201;
        ctx.body = {
            userData: dbUserInfo.user,
            token: dbUserInfo.token
        };
    } catch (error) {
        ctx.status = error.status || 500;
        const message = ctx.status === 500 ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu." : error.message;
        ctx.body = {error: message};
    }
});

router.post('/login', async (ctx) => {
    try {
        const userData = ctx.request.body;
        const userInfo = await authAPI.loginUser(userData);
        ctx.status = 200;
        ctx.body = {
            userData: userInfo.user,
            token: userInfo.token
        };
    } catch (error) {
        ctx.status = error.status || 500;
        const message = ctx.status === 500 ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu." : error.message;
        ctx.body = {error: message};
    }
})

module.exports = router;