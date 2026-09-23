const { sequelize } = require("../server/src/config/db");
const Award = require("../server/src/models/Award");
const { initDb } = require("../server/src/config/initDb");

const test = async () => {
  try {
    await initDb();
    const count = await Award.count();
    console.log("Awards count in DB:", count);
    const awards = await Award.findAll();
    console.log("Awards titles:", awards.map(a => a.title));
    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
};

test();
