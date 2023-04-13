import multer, { diskStorage } from "multer";
import { extname } from "path";

const upload = multer({
    storage: diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
            cb(new Error("Unsupported file type!"), false);
            return;
        }
        cb(null, true);
    },
    limits: {
        fileSize: 1 * 1024 * 1024
    }
})
    .array("image", 3)

const imageUpload = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) { //instanceof multer.MulterError
            res.status(500);
            if (error.code == 'LIMIT_FILE_SIZE') {
                error.message = 'File Size is too large. Allowed file size is 2MB';
                error.success = false;
            }
            return res.json(error);
        } else {
            if (!req.files) {
                res.status(500);
                res.json('file not found');
            }
            next()
        }
    })
};

export default imageUpload