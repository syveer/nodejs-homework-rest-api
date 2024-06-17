const multer = require("multer");
const Jimp = require("jimp");
const fs = require("fs").promises;
const path = require("path");
const User = require("../models/user");

const tmpDir = path.join(__dirname, "..", "tmp");
const publicDir = path.join(__dirname, "..", "public", "avatars");

const storage = multer.diskStorage({
  destination: tmpDir,
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const uploadFile = multer({ storage: storage }).single("avatar");

async function processAvatar(req, res, next) {
  const userId = req.user._id;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const avatar = await Jimp.read(req.file.path);
    await avatar.resize(250, 250).quality(80).writeAsync(req.file.path);

    const newFilename = `${userId}_${Date.now()}${path.extname(
      req.file.originalname
    )}`;
    const newPath = path.join(publicDir, newFilename);

    await fs.rename(req.file.path, newPath);

    const avatarURL = `/avatars/${newFilename}`;
    await User.findByIdAndUpdate(userId, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error); // Folosește middleware-ul de gestionare a erorilor
  }
}

module.exports = {
  uploadFile,
  processAvatar,
};
