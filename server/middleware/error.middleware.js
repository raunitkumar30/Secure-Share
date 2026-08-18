const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "File too large. Maximum allowed size is 10 MB."
        });
    }

    if (err.message === "File type not allowed") {
        return res.status(400).json({
            message: "File type not allowed"
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid file ID"
        });
    }

    res.status(500).json({
        message: "Internal server error"
    });
};

module.exports = errorHandler;