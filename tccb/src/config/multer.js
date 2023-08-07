import multer from "multer";
import path from "path";
import crypto from "crypto";

const uploads = {
    dest: path.resolve(".", "tmp", "uploads"),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve(".", "tmp", "uploads"))
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if(err) cb(err)
                
                const fileName = `${hash.toString("hex")}-${file.originalname}`

                cb(null, fileName)
            })
        },
    }),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif"
        ]
    
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo do arquivo inválido"));
        }
    },
}

export default uploads