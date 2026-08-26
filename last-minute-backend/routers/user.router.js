const Router = require("koa-router");
const userAPI = require("../src/resources/user");
const { verifyToken, verifyRoleUser } = require("../middlewares/auth.middleware"); 


const router = new Router();

router.get("/user/favorites", verifyToken, verifyRoleUser, async (ctx) => {
  try {
    const userId = ctx.state.user.id;

    const favoriteShopsIds = await userAPI.getFavoriteShopsIds(userId);

    ctx.status = 200;
    ctx.body = favoriteShopsIds;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.post("/user/favorites", verifyToken, verifyRoleUser, async (ctx) => {
  try {
    const userId = ctx.state.user.id;

    const { shopId } = ctx.request.body;
    if (!shopId) {
      ctx.throw(400, "Id-ul magazinului este obligatoriu.");
    }

    await userAPI.addFavoriteShop(userId, shopId);

    ctx.status = 201;
    ctx.body = {};

  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.delete("/user/favorites/:shopId", verifyToken, verifyRoleUser, async (ctx) => {
  try {
    console.log('here');
    const userId = ctx.state.user.id;

    const shopId = ctx.params.shopId;

    if (!shopId) {
      ctx.throw(400, "Id-ul magazinului este obligatoriu.");
    }

    await userAPI.removeFavoriteShop(userId, shopId);

    ctx.status = 204;

  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

module.exports = router;