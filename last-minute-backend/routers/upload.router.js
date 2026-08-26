const Router = require("koa-router");
const path = require("node:path");
const config = require("../config.json");
const fs = require("fs");  

const router = new Router();

router.get("/uploads/:file", async (ctx) => {
  const filePath = path.join(
    process.cwd(),
    config.imagesFolder,
    ctx.params.file,
  );

  if (!fs.existsSync(filePath)) {
    ctx.status = 404;
    ctx.body = "Not Found";
    return;
  }

  ctx.type = path.extname(filePath);
  ctx.body = fs.createReadStream(filePath);
});

module.exports = router;