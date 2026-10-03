const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const publicRoutes = require("./routes/publicRoutes");

dotenv.config();

const app = express();
// app.set("trust proxy", 1);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("Requested origin:", origin);

  if (origin) {
    // res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  // res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,Accept");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to ApnaVidya API v22222");
});



app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/public", publicRoutes);



app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    success: false,
    message,
    errors: err.errors || [],
  });
});

module.exports = app;
