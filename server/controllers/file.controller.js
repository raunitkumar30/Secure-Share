const File = require('../models/File');
const fs = require('fs').promises;
const crypto = require('crypto');

const uploadFile = async (req, res) => {


    const file = await File.create({
        originalName: req.file.originalname,
        storedName: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        owner: req.user.userId
    });

    res.status(201).json({
        message: "File uploaded and saved successfully",
        file: file
    });
};

const getFiles = async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
        Math.max(parseInt(req.query.limit) || 10, 1),
        50
    );

    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();

    const filter = {
        owner: req.user.userId
    };

    if (search) {
        filter.originalName = {
            $regex: search,
            $options: "i"
        };
    }

    const [files, totalFiles] = await Promise.all([
        File.find(filter)
            .select("-__v -path -storedName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),

        File.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalFiles / limit);

    res.status(200).json({
        message: "Files retrieved successfully",
        pagination: {
            page,
            limit,
            totalFiles,
            totalPages
        },
        files
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
        shareId: req.params.shareId,
        shareExpiresAt: { $gt: new Date() }
    });

    if (!file) {
        return res.status(404).json({
            message: "Shared file not found or link expired"
        });
    }

    if (
        file.shareExpiresAt &&
        file.shareExpiresAt < new Date()
    ) {
        return res.status(410).json({
            message: "Share link has expired"
        });
    }

    res.download(file.path, file.originalName);
};

const generateShareLink = async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) {
        return res.status(404).json({
            message: "File not found"
        });
    }

    if (file.owner.toString() !== req.user.userId) {
        return res.status(403).json({
            message: "You are not authorized to share this file"
        });
    }

    const shareId = crypto.randomBytes(16).toString("hex");

    file.shareId = shareId;
    file.shareExpiresAt = new Date(Date.now() + 10 * 60 * 1000);


    await file.save();

    res.status(200).json({
        message: "Share link generated successfully",
        shareId: file.shareId,
        shareLink: `${req.protocol}://${req.get("host")}/api/files/share/${file.shareId}`
    });
};

module.exports = {
    uploadFile, getFiles, downloadFile, deleteFile, getSharedFile, generateShareLink
};