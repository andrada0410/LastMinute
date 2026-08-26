const Router = require("koa-router");
const authRouter = require("./routers/auth.router");
const shopRouter = require("./routers/shop.router");
const offerRouter = require("./routers/offer.router");
const productRouter = require("./routers/product.router");
const reservationRouter = require("./routers/reservation.router");
const userRouter = require("./routers/user.router");
const uploadRouter = require("./routers/upload.router");

const router = new Router();

router.use(authRouter.routes());
router.use(shopRouter.routes());
router.use(offerRouter.routes());
router.use(productRouter.routes());
router.use(reservationRouter.routes());
router.use(userRouter.routes());
router.use(uploadRouter.routes());

module.exports = router;