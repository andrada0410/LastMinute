const Router = require("koa-router");
const offerAPI = require("../src/resources/offer");
const { verifyToken, verifyRoleShopuser } = require("../middlewares/auth.middleware");
const { verifyShopOwnership } = require("../middlewares/shop.middleware");

const router = new Router();

router.get("/offer", async (ctx) => {
  try {
    const { shopId, startDate, endDate, include } = ctx.query;

    if (!shopId || !startDate || !endDate || !include) {
      ctx.throw(400, "Lipsesc parametri obligatorii.");
    }

    const result = await offerAPI.getOfferByShop(Number(shopId), startDate, endDate, include);

    ctx.status = 200;
    ctx.body = result;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.post("/offer", verifyToken, verifyRoleShopuser, verifyShopOwnership, async (ctx) => {
  try {
    const { startDate, hoursAvailable, products } = ctx.request.body;
    const shopId = ctx.state.shopId;

    if (!startDate || !hoursAvailable || !products) {
      ctx.throw(400, "Lipsesc parametri obligatorii.");
    }

    const result = await offerAPI.createOffer(
        shopId,
        startDate,
        Number(hoursAvailable),
        products
    );

    ctx.status = 201;
    ctx.body = result;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.delete("/offer/:offerId", verifyToken, verifyRoleShopuser, verifyShopOwnership, async (ctx) => {
  try {
    const shopId = ctx.state.shopId;
    const offerId = ctx.params.offerId;

    await offerAPI.deleteOffer(offerId, shopId);

    ctx.status = 204;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message } 
  }
});

router.get("/offer/max-price", async (ctx) => {
  try {
    const maxPrice = await offerAPI.getMaxOfferPriceToday();

    ctx.status = 200;
    ctx.body = maxPrice;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});


module.exports = router;