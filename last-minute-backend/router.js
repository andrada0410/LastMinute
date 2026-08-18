const Router = require("koa-router");
const exampleAPI = require("./src/resources/example");
const userAPI = require("./src/resources/user");
const authAPI = require("./src/resources/auth");
const config = require("./config.json");
const fs = require("fs");
const path = require("node:path");
const shopAPI = require("./src/resources/shop");
const categoryAPI = require("./src/resources/shop-category");
const jwt = require("jsonwebtoken");
const multer = require("@koa/multer");
const geocodingAPI = require('./src/data-exchange/map-nominatim/index');
const productAPI = require("./src/resources/product");
const ExcelJS = require('exceljs');
const { runInNewContext } = require("node:vm");
const offerAPI = require("./src/resources/offer");
const reservationAPI = require("./src/resources/reservation");

const router = new Router();
const JWT_KEY = config.databaseConfig.jwtKey;

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), config.imagesFolder);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, config.imagesFolder + "/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});
const uploadImages = multer({ storage: diskStorage });

const memoryStorage = multer.memoryStorage();
const uploadTemp = multer({ storage: memoryStorage });

const verifyToken = async (ctx, next) => {
  if (ctx.method === "OPTIONS") {
    await next();
    return;
  }

  const authHeader = ctx.request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = {
      error: "Acces interzis. Token-ul lipsește sau este invalid!",
    };
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedPayload = jwt.verify(token, JWT_KEY);
    ctx.state.user = decodedPayload;

    await next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = {
      error: "Token invalid sau expirat!",
    };
    return;
  }
};

const verifyRoleSuperuser = async (ctx, next) => {
  if (ctx.method === "OPTIONS") {
    await next();
    return;
  }

  const role = ctx.state.user?.role;
  if (!role || role !== "SUPERUSER") {
    ctx.status = 403;
    ctx.body = {
      error: "Nu aveți permisiunea de a accesa această resursă.",
    };
    return;
  }

  await next();
};

const verifyRoleUser = async (ctx, next) => {
  if (ctx.method === "OPTIONS") {
    await next();
    return;
  }

  const role = ctx.state.user?.role;
  if (!role || role !== "USER") {
    ctx.status = 403;
    ctx.body = {
      error: "Nu aveți permisiunea de a accesa această resursă.",
    };
    return;
  }

  await next();
};


const verifyRoleShopuser = async (ctx, next) => {
  if (ctx.method === "OPTIONS") {
    await next();
    return;
  }

  const role = ctx.state.user?.role;
  if (!role || role !== "SHOPUSER") {
    ctx.status = 403;
    ctx.body = {
      error: "Nu aveți permisiunea de a accesa această resursă.",
    };
    return;
  }

  await next();
};

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

router.get('/Example', async (ctx, next) => {
    ctx.response.body = await exampleAPI.get();
    ctx.response.status = 200;
});

router.get("/Example/:id", async (ctx, next) => {
  ctx.response.body = await exampleAPI.getById(ctx.params.id);
  ctx.response.status = 200;
});

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

router.post('/register-shop', verifyToken, verifyRoleSuperuser, async (ctx) => {
    try {
        const body = ctx.request.body;
        const userInfo = body.user;
        const shopInfo = body.shop;

        const existingUser = await userAPI.getUserByEmail(userInfo.email);
        if (existingUser) {
          const message = existingUser.shop_is_deleted == 1
                ? "Emailul este deja utilizat de catre un cont blocat!"
                : "Emailul este deja utilizat de catre un cont existent!";
          const err = new Error(message);
          err.status = 400;
          throw err;
        }

    const createdUser = await userAPI.createUser({
      email: userInfo.email,
      password: userInfo.password,
      role: "SHOPUSER",
    });

    const createdShop = await shopAPI.createShop({
      userId: createdUser.id,
      address: shopInfo.address,
      name: shopInfo.name,
    });

    ctx.status = 201;
    ctx.body = {
      userData: {
        id: createdUser.id,
        email: createdUser.email,
      },
      shopData: createdShop,
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
  "/shop/:id/dashboard",
  verifyToken,
  verifyRoleShopuser,
  uploadImages.fields([
    { name: "logo", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),

  async (ctx) => {
    try {
      const shopId = ctx.params.id;
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

router.post('/login', async (ctx) => {
    try {
        const userData = ctx.request.body;
        const userInfo = await authAPI.loginUser(userData);

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

router.get('/shops/map', async (ctx) => {
    try {
        const categoryIdStr = ctx.query.categoryId;
        const maxPriceStr = ctx.query.maxPrice;

        let categoryId = undefined;
        let maxPrice = undefined;

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

        const filter = {
          categoryId: categoryId,
          maxPrice: maxPrice
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
    if (parseInt(ctx.request.body.shopId, 10) !== ctx.state.shopId) {
      ctx.status = 403;
      ctx.body = { error: "Nu puteți adăuga produse pentru alt magazin." };
      return;
    }

    const product = await productAPI.createProduct({
      shopId: ctx.request.body.shopId,
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

router.post("/shop/:shopId/products/import",
  verifyToken,
  verifyRoleShopuser,
  verifyShopOwnership,
  uploadTemp.single("file"),
  async (ctx) => {
    try {
      const { shopId } = ctx.params;

      if (parseInt(shopId) !== ctx.state.shopId) {
        ctx.status = 403;
        ctx.body = { error: "Magazinul nu a fost găsit sau nu vă aparține."}
        return;
      }

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

router.get("/offer", async (ctx) => {
  try {
    const { shopId, startDate, endDate, include } = ctx.query;

    if (!shopId || !startDate || !endDate || !include) {
      ctx.throw(400, "Lipsesc parametri obligatorii.");
    }

    const result = await offerAPI.getOfferByShop(Number(shopId), startDate, endDate, include);

    ctx.status = 200;
    ctx.body = result ;
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

router.get("/reservation/shop/:shopId/statistics", verifyToken, verifyRoleShopuser, verifyShopOwnership, async (ctx) => {
    try {
      const { shopId } = ctx.params;

      if (parseInt(shopId, 10) !== ctx.state.shopId) {
        ctx.status = 403;
        ctx.body = {
          error: "Nu puteți accesa statisticile altui magazin."
        };
        return;
      }

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
