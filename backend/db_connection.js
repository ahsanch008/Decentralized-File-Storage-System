const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from config.env file
dotenv.config({ path: "./config.env" });

const connect_db = () => {
  return mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    console.log("DB connection successful");
  })
  .catch((error) => {
    console.error("DB connection failed:", error.message);
    process.exit(1); // Exit the application on connection failure
  });
}

module.exports = { connect_db };
