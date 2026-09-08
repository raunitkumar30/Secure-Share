const File = require('../models/File');
const fs = require('fs').promises;
const crypto = require('crypto');

const uploadFile = async (req, res) => {
    const shareId = crypto.randomBytes(8).toString('hex');

    const file = await File.create({
        originalName: req.file.originalname,
        storedName: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        shareId: shareId,
        owner: req.user.userId
    });

    res.status(201).json({
        message: "File uploaded and saved successfully",
        file: file
    });
};

const getFiles = async (req, res) => {
    const files = await File.find({
        owner: req.user.userId
    });
    res.status(200).json({
        message: "Files retrieved successfully",
        files: files
    });
};

const downloadFile = async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) {
        return res.status(404).json({
            message: "File not found"
        });
    }

    if (file.owner.toString() !== req.user.userId) {
        return res.status(403).json({
            message: "You are not authorized to download this file"
        });
    }

    res.download(file.path, file.originalName);
};

const deleteFile = async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) {
        return res.status(404).json({
            message: "File not found"
        });
    }

    if (file.owner.toString() !== req.user.userId) {
        return res.status(403).json({
            message: "You are not authorized to delete this file"
        });
    }

    await fs.unlink(file.path);

    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: "File deleted successfully"
    });
};


const getSharedFile = async (req, res) => {
    const file = await File.findOne({
        shareId: req.params.shareId
    });

    if (!file) {
        return res.status(404).json({
            message: "Shared file not found"
        });
    }

    res.download(file.path, file.originalName);
};

module.exports = {
    uploadFile, getFiles, downloadFile, deleteFile, getSharedFile
};