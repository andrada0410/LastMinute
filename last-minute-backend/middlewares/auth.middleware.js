const jwt = require("jsonwebtoken");
const config = require("../config.json");
const JWT_KEY = config.databaseConfig.jwtKey;

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

  let decodedPayload;
  try {
    decodedPayload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    ctx.status = 401;
    ctx.body = {
      error: "Token invalid sau expirat!",
    };
    return;
  }

  ctx.state.user = decodedPayload;

  await next();
};

const optionalVerifyToken = async (ctx, next) => {
    const authHeader = ctx.request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        await next();
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedPayload = jwt.verify(token, JWT_KEY);
        ctx.state.user = decodedPayload;
    } catch (err) {
        ctx.state.user = undefined;
    }

    await next();
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

module.exports = {
    verifyToken,
    optionalVerifyToken,
    verifyRoleUser,
    verifyRoleSuperuser,
    verifyRoleShopuser
}