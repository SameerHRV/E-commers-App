import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/assets");
  },
  filename(req, file, cb) {
    const uniqueSuffix = uuidv4();
    const exeName = file.originalname.split(".").pop();
    const filename = `${uniqueSuffix}.${exeName}`;
    cb(null, filename);
  },
});

export const uploadImage = multer({ storage }).single("image");
