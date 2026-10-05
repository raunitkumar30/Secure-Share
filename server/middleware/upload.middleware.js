const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx",
        ".txt",
        ".jpg",
        ".jpeg",
        ".png"
    ];

    const allowedMimeTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png"
    ];

    const extension = path.extname(file.originalname).toLowerCase();

    console.log("Original Name:", file.originalname);
    console.log("MIME Type:", file.mimetype);
    console.log("Extension:", extension);

    if (
        allowedExtensions.includes(extension) &&
        (
            allowedMimeTypes.includes(file.mimetype) ||
            file.mimetype === "application/octet-stream"
        )
    ) {
        cb(null, true);
    } else {
        cb(new Error("File type not allowed"), false);
    }
};

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },

    filename: function(req, file, cb) {
        const extension = path.extname(file.originalname);
        const randomName = crypto.randomBytes(16).toString("hex");

        cb(null, randomName + extension);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: fileFilter
});

module.exports = upload;