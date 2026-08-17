require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const fileRoutes = require("./routes/file.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

const PORT = 5000;

app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to Secure Share 🚀");
});

app.post("/test", (req, res) => {
    console.log(req.body);
    res.send("Data received successfully");
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});