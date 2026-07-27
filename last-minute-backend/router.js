const Router = require('koa-router');
const router = new Router();
const exampleAPI = require('./src/resources/example');
const userAPI = require('./src/resources/user')
const authAPI = require('./src/resources/auth')
const config = require('./config.json')
const fs = require('fs');
const path = require('node:path');
const shopAPI = require('./src/resources/shop');
const user = require('./src/resources/user');
const shop = require('./src/resources/shop');
const jwt = require('jsonwebtoken');

const JWT_KEY = config.databaseConfig.jwtKey;

const verifyToken = async (ctx, next) => {
    if (ctx.method === 'OPTIONS') {
        await next();
        return;
    }

    const authHeader = ctx.request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = {
            error: "Acces interzis. Token-ul lipsește sau este invalid!"
        }
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedPayload = jwt.verify(token, JWT_KEY);
        ctx.state.user = decodedPayload;

        await next();
    } catch(err) {
        ctx.status = 401;
        ctx.body = {
             error: "Token invalid sau expirat!" 
        };
        return;
    }
}

const verifyRoleSuperuser = async (ctx, next) => {
    if (ctx.method === 'OPTIONS') {
        await next();
        return;
    }   

    const role = ctx.state.user?.role;
    if (!role || role !== 'SUPERUSER') {
        ctx.status = 403;
        ctx.body = {
            error: "Nu aveți permisiunea de a accesa această resursă."
        }
        return;
    }

    await next();
}

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

        console.log(userInfo);
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

router.post('/register-shop', verifyToken, verifyRoleSuperuser, async (ctx) => {
    try {
        const body = ctx.request.body;
        const userInfo = body.user;
        const shopInfo = body.shop;

        const existingUser = await userAPI.getUserByEmail(userInfo.email);
        if (existingUser) {
            const err = new Error("Emailul este deja utilizat de catre un cont blocat!");
            err.status = 400;
            throw err;
        }

        const createdUser = await userAPI.createUser({
            email: userInfo.email,
            password: userInfo.password,
            role: 'SHOPUSER'
        });

        const createdShop = await shopAPI.createShop({
            userId: createdUser.id,
            address: shopInfo.address,
            name: shopInfo.name
        });

        ctx.status = 201;
        ctx.body = {
            userData: { 
                id: createdUser.id, 
                email: createdUser.email 
            },
            shopData: createdShop
        };
    } catch (error) {
        ctx.status = error.status || 500;
        const message = ctx.status === 500 ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu." : error.message;
        ctx.body = {error: message};
    }
});

router.get('/shop', verifyToken, verifyRoleSuperuser, async (ctx) => {
    try {
        const page = parseInt(ctx.query.page) || 1;
        const limit = parseInt(ctx.query.limit) || 5;

        const shopList = await shopAPI.getShopsInfo(page, limit);
        const totalRows = shopList.length > 0 ? shopList[0].totalRecords : 0;

        ctx.status = 200;
        ctx.body = {
            entry: shopList,
            total: totalRows
        };

    } catch (error) {
        ctx.status = 500;
        ctx.body = {error: error.message};
    }
});

router.patch('/shop/:id', verifyToken, verifyRoleSuperuser, async (ctx) => {
    try {
        const { id } = ctx.params;
        const { name, address } = ctx.request.body;

        const updatedShop = await shopAPI.updateShop(id, name, address);

        ctx.status = 200;
        ctx.body = updatedShop;
    } catch (error) {
        ctx.status = error.status || 500;
        const message = ctx.status === 500 ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu." : error.message;
        ctx.body = {error: message};
    }
});

router.delete('/shop/:id', verifyToken, verifyRoleSuperuser, async (ctx) => {
    try {
        const { id } = ctx.params;
        await shopAPI.deleteShop(id);

        ctx.status = 204;
    } catch (error) {
        ctx.status = error.status || 500;
        const message = ctx.status === 500 ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu." : error.message;
        ctx.body = {error: message};
    }
});

module.exports = router;