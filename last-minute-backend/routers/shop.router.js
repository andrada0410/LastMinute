const Router = require("koa-router");
const shopAPI = require("../src/resources/shop");
const categoryAPI = require("../src/resources/shop-category");
const userAPI = require("../src/resources/user");
const { verifyToken, verifyRoleSuperuser, verifyRoleShopuser, optionalVerifyToken } = require("../middlewares/auth.middleware");
const { uploadImages } = require("../middlewares/upload.middleware");
const { geocodeShopMiddleware, verifyShopOwnership } = require("../middlewares/shop.middleware");

const router = new Router();

router.get("/shop", verifyToken, verifyRoleSuperuser, async (ctx) => {
  try {
    const page = parseInt(ctx.query.page) || 1;
    const limit = parseInt(ctx.query.limit) || 5;
    const email = ctx.query.email || null;

    const shopList = await shopAPI.getShopsInfo({page, limit, email});
    const totalRows = shopList.length > 0 ? shopList[0].totalRecords : 0;

    ctx.status = 200;
    ctx.body = {
      entry: shopList,
      total: totalRows,
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: error.message };
  }
});

router.get("/shop/mine", verifyToken, verifyRoleShopuser, async (ctx) => {
  const userId = ctx.state.user.id;
  ctx.response.body = await shopAPI.getShopByUser(userId);
  ctx.status = 200;
});

router.get('/shop/map', optionalVerifyToken, async (ctx) => {
    try {
        const categoryIdStr = ctx.query.categoryId;
        const maxPriceStr = ctx.query.maxPrice;
        const onlyFavoritesStr = ctx.query.onlyFavorites;

        let categoryId = undefined;
        let maxPrice = undefined;
        let onlyFavorites = undefined;
        let userId = undefined;

        if (categoryIdStr !== undefined && categoryIdStr !== '') {
            const rawIds = categoryIdStr.split(',');
            
            const isValidList = rawIds.every(id => !isNaN(parseInt(id)) && Number.isInteger(Number(id)));
            
            if (!isValidList) {
                ctx.status = 400;
                ctx.body = { error: "Categoriile specificate sunt invalide." };
                return;
            }

            categoryId = rawIds.map(id => parseInt(id));        
        }

        if (maxPriceStr !== undefined && maxPriceStr !== '') {
            const parsedMaxPrice = Number(maxPriceStr);

            if (isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
                ctx.status = 400;
                ctx.body = {
                    error: "Prețul maxim specificat este invalid."
                };
                return;
            }

            maxPrice = parsedMaxPrice;
        }

        if (onlyFavoritesStr === 'true') {
          userId = ctx.state.user?.id;

          if (!userId) {
            ctx.status = 401;
            ctx.body = { error: "Trebuie să fii autentificat pentru a vedea magazinele favorite." };
            return;
          }

          onlyFavorites = true;
        }

        const filter = {
          categoryId: categoryId,
          maxPrice: maxPrice,
          onlyFavorites: onlyFavorites,
          userId: userId
        }

        const shopMapData = await shopAPI.getShopsForMap(filter);

        ctx.status = 200;
        ctx.body = {
            entry: shopMapData
        }
    } catch (error) {
        ctx.status = 400;
        ctx.body = {error: error.message};
    }
});

router.get("/shop/:id", async (ctx) => {
  try {
    let shopData = await shopAPI.getShopById(ctx.params.id);
    let contact = { email: undefined };
    const user = await userAPI.getUserById(shopData.user_id);
    const { email } = user[0] || {};
    if (email) {
      contact.email = email;
    }
    shopData.contact = contact;

    ctx.response.body = shopData;
    ctx.status = 200;
  } catch (error) {
    ctx.status = error.status || 500;
    const message =
      ctx.status === 500
        ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu."
        : error.message;
    ctx.body = { error: message };
  }
});

router.patch(
  "/shop/dashboard",
  verifyToken,
  verifyRoleShopuser,
  verifyShopOwnership,
  uploadImages.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),

  async (ctx) => {
    try {
      const shopId = ctx.state.shopId;
      const textData = ctx.request.body;
      const uploadedFiles = ctx.request.files;

      let parsedCategoryId = undefined;
      if (textData.categoryId && textData.categoryId !== "null") {
        parsedCategoryId = parseInt(textData.categoryId, 10);
      }

      const result = await shopAPI.updateShop(
        shopId, {
          details: textData.details,
          logo: uploadedFiles.logo,
          banner: uploadedFiles.banner,
          categoryId: parsedCategoryId
        }
      );

      ctx.status = 200;
      ctx.body = result;
    } catch (error) {
      console.log(error);
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  },
);

router.patch('/shop/:id', verifyToken, verifyRoleSuperuser, geocodeShopMiddleware, async (ctx, next) => {
    try {
        const { id } = ctx.params;
        const { name, address } = ctx.request.body;

        if (!id || ctx.request.body.id != id) {
            ctx.status = 400;
            ctx.body = {error: "id-ul din corpul cererii nu corespunde cu id-ul din ruta."};
            return;
        }

        const updatedShop = await shopAPI.updateShop(id, { name: name, address: address });

        ctx.status = 200;
        ctx.body = updatedShop;
        
        ctx.shop = {};
        ctx.shop.shopId = id;
        ctx.shop.address = address;

        await next();
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
  },
);

router.get('/shop-category', async (ctx) => {
  try {
    categories = await categoryAPI.getAll();

    ctx.status = 200;
    ctx.body = categories;
  } catch (error) {
    ctx.status = error.status || 500;
    const message = ctx.status === 500 ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu." : error.message;
    ctx.body = {error: message};
  }
});

module.exports = router;