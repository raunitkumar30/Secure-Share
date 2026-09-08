const express = require("express");
const upload = require("../middleware/upload.middleware");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/auth.middleware");

const {
    uploadFile,
    getFiles,
    downloadFile,
    deleteFile,
    getSharedFile
} = require("../controllers/file.controller");

const router = express.Router();

router.post(
    "/upload",
    protect,
    (req, res, next) => {
        upload.single("filename")(req, res, (err) => {
            if (err) {
                return next(err);
            }
            next();
        });
    },
    asyncHandler(uploadFile)
);

router.get(
    "/",
    protect,
    asyncHandler(getFiles)
);

router.get("/share/:shareId", asyncHandler(getSharedFile));

router.get(
    "/:id/download",
    protect,
    asyncHandler(downloadFile)
);

router.delete(
    "/:id",
    protect,
    asyncHandler(deleteFile)
);


module.exports = router;