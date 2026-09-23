require("dotenv").config();
const app = require("./src/app");
const { initDb } = require("./src/config/initDb");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initDb();
    app.listen(PORT, () => {
      console.log(`ApnaVidya Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1);
  }
};


startServer();