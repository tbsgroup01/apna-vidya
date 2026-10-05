require("dotenv").config();
const app = require("./src/app");
const { initDb } = require("./src/config/initDb");
const { seedData } = require("./src/config/seedData");

const PORT = process.env.PORT || 3303;

const startServer = async () => {
  try {
    await initDb();

    // One call to feed certificate, courses, testimonials, 5 blogs
    await seedData();

    app.listen(PORT, () => {
      console.log(`ApnaVidya Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to initialize server:", err);
    process.exit(1);
  }
};

startServer();