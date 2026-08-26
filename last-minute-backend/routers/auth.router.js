const Router = require("koa-router");
const userAPI = require("../src/resources/user");
const authAPI = require("../src/resources/auth");
const shopAPI = require("../src/resources/shop");
const { verifyToken, verifyRoleSuperuser } = require("../middlewares/auth.middleware");
const { geocodeShopMiddleware } = require("../middlewares/shop.middleware");

const router = new Router();

router.post("/register", async (ctx) => {
  try {
    const userNetworkInput = ctx.request.body;
    const dbUserInfo = await authAPI.registerUser(userNetworkInput);

    ctx.status = 201;
    ctx.body = {
      userData: dbUserInfo.user,
      token: dbUserInfo.token,
    };
  } catch (error) {
    ctx.status = error.status || 500;
    const message =
      ctx.status === 500
        ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu."
        : error.message;
    ctx.body = { error: message };
  }
});

router.post("/login", async (ctx) => {
  try {
    const userData = ctx.request.body;
    const userInfo = await authAPI.loginUser(userData);

    ctx.status = 200;
    ctx.body = {
      userData: userInfo.user,
      token: userInfo.token,
    };
  } catch (error) {
    ctx.status = error.status || 500;
    const message =
      ctx.status === 500
        ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu."
        : error.message;
    ctx.body = { error: message };
  }
});

router.post('/register-shop', verifyToken, verifyRoleSuperuser, geocodeShopMiddleware, async (ctx, next) => {
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

        ctx.shop = {};
        ctx.shop.shopId = createdShop.id;
        ctx.shop.address = shopInfo.address;

        await next();

    } catch (error) {
        ctx.status = error.status || 500;
        const message = ctx.status === 500 ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu." : error.message;
        ctx.body = {error: message};
    }
});


module.exports = router;