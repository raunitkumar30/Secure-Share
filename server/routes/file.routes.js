const express = require("express");
const upload = require("../middleware/upload.middleware");
const asyncHandler = require("../middleware/asyncHandler");

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
    upload.single("filename"),
    asyncHandler(uploadFile)
);

router.get("/", asyncHandler(getFiles));

router.get("/share/:shareId", asyncHandler(getSharedFile));

router.get("/:id/download", asyncHandler(downloadFile));

router.delete("/:id", asyncHandler(deleteFile));



module.exports = router;