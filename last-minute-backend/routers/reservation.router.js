const Router = require("koa-router");
const reservationAPI = require("../src/resources/reservation");
const offerAPI = require("../src/resources/offer");
const { verifyToken, verifyRoleUser, verifyRoleShopuser } = require("../middlewares/auth.middleware");
const { verifyShopOwnership } = require("../middlewares/shop.middleware");

const router = new Router();

router.post("/reservation", verifyToken, verifyRoleUser, async (ctx) => {
  try {
    const userId = ctx.state.user.id;
    const { offerId, productId, quantity } = ctx.request.body;

    if (!offerId || !productId || !quantity || quantity <= 0) {
      ctx.throw(400, "Lipsesc parametri obligatorii.");
    }

    const offerProduct = await offerAPI.getOfferProductDetails(offerId, productId);

    if (!offerProduct) {
      ctx.throw(404, "Produsul nu a fost găsit în această ofertă.");
    }

    if (offerProduct.quantity < quantity) {
      ctx.throw(400, "Stoc insuficient pentru cantitatea cerută.");
    }

    const unitPrice = offerProduct.price * (100 - offerProduct.discountPercent) / 100.0;
    const totalPrice = unitPrice* quantity;

    const newReservation = await reservationAPI.createReservation({
      userId,
      offerId,
      productId,
      quantity,
      unitPrice,
      totalPrice
    });

    const stock = await offerAPI.updateOfferStock(offerId, productId, quantity);

    ctx.status = 201;
    ctx.body = newReservation;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.patch("/reservation/:id/confirm", verifyToken, verifyRoleShopuser, verifyShopOwnership, async (ctx) => {
    try {
      const { id } = ctx.params;
 
      const updated = await reservationAPI.confirmReservation(id, ctx.state.shopId);
 
      ctx.status = 200;
      ctx.body = updated;
    } catch (error) {
      ctx.status = error.status || 400;
      ctx.body = { error: error.message };
    }
});

router.patch("/reservation/:id/cancel", verifyToken, verifyRoleShopuser, verifyShopOwnership, async (ctx) => {
    try {
      const { id } = ctx.params;
 
      const updated = await reservationAPI.cancelReservation(id, ctx.state.shopId);
 
      ctx.status = 200;
      ctx.body = updated;
    } catch (error) {
      ctx.status = error.status || 400;
      ctx.body = { error: error.message };
    }
});

router.get("/reservation", verifyToken, async (ctx) => {
  try {
    const statusStr = ctx.query.status;
    const validStatuses = ["PENDING", "COMPLETED", "CANCELLED"];

    const filter = {};

    if (statusStr !== undefined && statusStr !== "") {
      const rawStatuses = statusStr.split(",");

      const isValidList = rawStatuses.every(s => validStatuses.includes(s));

      if (!isValidList) {
        ctx.status = 400;
        ctx.body = {
          error: "Statusurile specificate sunt invalide."
        };
        return;
      }

      filter.status = rawStatuses;
    }

    const { userId, shopId, page, limit } = ctx.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    if (!isNaN(pageNumber) && pageNumber > 0 && !isNaN(limitNumber) && limitNumber > 0) {
      filter.page = pageNumber;
      filter.limit = limitNumber;
    }

    const hasUserId = userId !== undefined && userId !== "";
    const hasShopId = shopId !== undefined && shopId !== "";

    if (hasUserId === hasShopId) {
      ctx.status = 400;
      ctx.body = {
        error: "Trebuie specificat exact unul dintre userId sau shopId."
      };
      return;
    }

    if (hasUserId) {
      if (ctx.state.user.role !== "USER") {
        ctx.status = 403;
        ctx.body = {
          error: "Nu ai permisiunea de a accesa rezervarile dupa userId."
        };
        return;
      }
      filter.userId = userId;
    } else {
      if (ctx.state.user.role !== "SHOPUSER") {
        ctx.status = 403;
        ctx.body = {
          error: "Nu ai permisiunea de a accesa rezervarile dupa shopId."
        };
        return;
      }
      filter.shopId = shopId;
    }

    const reservations = await reservationAPI.getReservations(filter);
    
    const totalRows = reservations.length > 0 ? reservations[0].totalCount : 0
    const cleanEntries = reservations.map(r => {
        const { totalCount, ...rest} = r;
        return rest;
    });

    ctx.status = 200;
    ctx.body = {
      entry: cleanEntries,
      total: totalRows
    };
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      error: error.message
    };
  }
});

router.get("/reservation/statistics", verifyToken, verifyRoleShopuser, verifyShopOwnership, async (ctx) => {
    try {
      const statistics = await reservationAPI.getShopOfferStatistics(ctx.state.shopId);

      ctx.status = 200;
      ctx.body = statistics;

      } catch (error) {
        ctx.status = error.status || 500;
        ctx.body = { error: error.message };
      }
    }
);

module.exports = router;