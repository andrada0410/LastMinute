const shopAPI = require("../src/resources/shop");
const geocodingAPI = require("../src/data-exchange/map-nominatim")

const geocodeShopMiddleware = async (ctx, next) => {
    await next();
    const shopId = ctx.shop?.shopId || ctx.params.id;
    const address = ctx.shop?.address || (ctx.request.body && ctx.request.body.address);

    if (!shopId || !address) {
        return;
    }

    try {
        const coordinates = await geocodingAPI.geocodeAddress(address);
        const { lat, lon } = coordinates;

        await shopAPI.updateShopCoordinates(shopId, lat, lon);
        
    } catch (error) {
        console.error(`Eroare de fundal la geocodarea magazinului ${shopId}:`, error.message);
        try {
            await shopAPI.resetShopCoordinates(shopId);
        } catch (resetError) {
            console.error(`Eroare fatală: Nu am putut reseta coordonatele pentru ${shopId}:`, resetError.message);
        }
    }
};

const verifyShopOwnership = async (ctx, next) => {
  if (ctx.method === "OPTIONS") {
    await next();
    return;
  }

  try {
    const userId = ctx.state.user.id;
    const shop = await shopAPI.getShopByUser(userId);

    if (!shop) {
      ctx.status = 403;
      ctx.body = { error: "Nu aveți un magazin asociat contului dvs." };
      return;
    }

    ctx.state.shopId = shop.id;
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
};

module.exports = {
    verifyShopOwnership,
    geocodeShopMiddleware
}