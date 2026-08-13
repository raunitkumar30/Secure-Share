const express = require("express");
const upload = require("../middleware/upload.middleware");

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
    uploadFile
);

router.get("/", getFiles);

router.get("/share/:shareId", getSharedFile);

router.get("/:id/download", downloadFile);

router.delete("/:id", deleteFile);



module.exports = router;