import multer from "multer";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/assets");
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploadImage = multer({ storage }).single("image");
