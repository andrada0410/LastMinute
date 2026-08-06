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

const router = new Router();
const JWT_KEY = config.databaseConfig.jwtKey;

const storage = multer.diskStorage({
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

const upload = multer({ storage: storage });

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

router.get("/Example", async (ctx, next) => {
  ctx.response.body = await exampleAPI.get();
  ctx.response.status = 200;
});

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

router.get("/shop/:id", verifyToken, verifyRoleShopuser, async (ctx) => {
  ctx.response.body = await shopAPI.getShopById(ctx.params.id);
  ctx.status = 200;
});

router.patch(
  "/shop/:id/dashboard",
  verifyToken,
  verifyRoleShopuser,
  upload.fields([
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

        let categoryId = undefined;

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

        const filter = {
          categoryId: categoryId,
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

router.post("/product", verifyToken, verifyRoleShopuser, verifyShopOwnership, upload.fields([{ name: "product", maxCount: 1 }]), async (ctx) => {
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

router.patch("/product/:id", verifyToken, verifyRoleShopuser, verifyShopOwnership, upload.fields([{ name: "product", maxCount: 1 }]), async (ctx) => {
  try {
    const shopProducts = await productAPI.getProductsByShop(ctx.state.shopId);
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

    const shopProducts = await productAPI.getProductsByShop(ctx.state.shopId);
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

module.exports = router;
