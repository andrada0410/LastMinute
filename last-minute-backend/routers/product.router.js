const Router = require("koa-router");
const productAPI = require("../src/resources/product");
const { verifyToken, verifyRoleShopuser } = require("../middlewares/auth.middleware");
const { verifyShopOwnership } = require("../middlewares/shop.middleware");
const { uploadImages, uploadTemp } = require("../middlewares/upload.middleware");
const ExcelJS = require('exceljs');

const router = new Router();

router.get("/product", verifyToken, verifyRoleShopuser, verifyShopOwnership, async (ctx) => {
  try {
    const { shopId, name  } = ctx.query;

    if (!shopId) {
      ctx.status = 400;
      ctx.body = { error: "shopId este obligatoriu." };
      return;
    }

    const filter = {
      shopId: shopId,
      name: name
    };

    const products = await productAPI.getProducts(filter);

    ctx.status = 200;
    ctx.body = products;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.post("/product", verifyToken, verifyRoleShopuser, verifyShopOwnership, uploadImages.fields([{ name: "product", maxCount: 1 }]), async (ctx) => {
  try {
    const product = await productAPI.createProduct({
      shopId: ctx.state.shopId,
      name: ctx.request.body.name,
      price: ctx.request.body.price,
      description: ctx.request.body.description,
      photo: ctx.request.files.product
    });

    ctx.status = 201;
    ctx.body = product;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.patch("/product/:id", verifyToken, verifyRoleShopuser, verifyShopOwnership, uploadImages.fields([{ name: "product", maxCount: 1 }]), async (ctx) => {
  try {
    const filter = {
      shopId : ctx.state.shopId
    }
    
    const shopProducts = await productAPI.getProducts(filter);
    const belongsToShop = shopProducts.some(p => p.id == ctx.params.id);

    if (!belongsToShop) {
      ctx.status = 404;
      ctx.body = { error: "Produsul nu a fost găsit." };
      return;
    }

    const product = await productAPI.updateProduct(
      ctx.params.id,
      {
        name: ctx.request.body.name,
        price: ctx.request.body.price,
        description: ctx.request.body.description,
        photo: ctx.request.files.product
      }
    );

    ctx.status = 200;
    ctx.body = product;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.delete("/product/:id", verifyToken, verifyRoleShopuser, verifyShopOwnership, async (ctx) => {
  try {
    const { id } = ctx.params;
    const filter = {
      shopId: ctx.state.shopId
    }

    const shopProducts = await productAPI.getProducts(filter);
    const belongsToShop = shopProducts.some(p => p.id == id);

    if (!belongsToShop) {
      ctx.status = 404;
      ctx.body = { error: "Produsul nu a fost găsit." };
      return;
    }

    await productAPI.deleteProduct(id);

    ctx.status = 204;
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = { error: error.message };
  }
});

router.post("/product/import",
  verifyToken,
  verifyRoleShopuser,
  verifyShopOwnership,
  uploadTemp.single("file"),
  async (ctx) => {
    try {
      const file = ctx.request.file;
      if (!file || !file.buffer) {
        ctx.status = 400;
        ctx.body = { error: "Nu există un fișier asociat."}
        return;
      }

      const originalName = file.originalname || "";
      const isExcel = originalName.toLocaleLowerCase().endsWith(".xlsx");

      if (!isExcel) {
        ctx.status = 400;
        ctx.body = { error: "Sunt acceptate doar fișiere .xlsx."}
        return;
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);

      const worksheet = workbook.getWorksheet(1);
      if (!worksheet) {
        ctx.status = 400;
        ctx.body = { error: "Nu există datele produselor."};
        return;
      }

      const productsToInsert = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        const name = row.getCell(1).value?.toString().trim();
        const priceRaw = row.getCell(2).value;
        const description = row.getCell(3).value?.toString().trim();
        const imagePath = row.getCell(4).value?.toString().trim();

        if (!name) {
          return;
        }

        const price = parseFloat(priceRaw);
        if (isNaN(price) || price <= 0) {
          return;
        }

        if (!description) {
          return;
        }
        
        const product = {
            shopId: ctx.state.shopId,
            name,
            price,
            description,
        }

        if (imagePath) {
          product.photo = imagePath;
        }

        productsToInsert.push(product);
      });

      if (productsToInsert.length === 0) {
        ctx.status = 400;
        ctx.body = {
          error: "Nu s-au găsit produse valide în fișier.",
        };
        return;
      }

      for (const product of productsToInsert) {
        await productAPI.createProduct(product);
      }

      ctx.status = 200;
      ctx.body = {
        successCount: productsToInsert.length
      };

    }
    catch (error) {
      ctx.status = error.status || 500;
      const message =
        ctx.status === 500
          ? "Eroare internă a serverului. Vă rugăm să încercați din nou mai târziu."
          : error.message;
      ctx.body = { error: message };
    }
  }
)


module.exports = router;