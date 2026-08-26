const multer = require("@koa/multer");
const path = require("node:path");
const config = require("../config.json");
const fs = require("node:fs");

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

const uploadImages = multer({
   limits: {
    fileSize: 5 * 1024 * 1024,
   },

   fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Te rugăm să încarci doar imagini de tip JPG, PNG, WEBP.");
      error.status = 400;
      cb(error, false);
    }
   },

   storage: diskStorage });

const memoryStorage = multer.memoryStorage();

const uploadTemp = multer({ storage: memoryStorage });

module.exports = {
    uploadImages,
    uploadTemp
}