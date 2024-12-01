const mongoose = require("mongoose");

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Conectat la MongoDB!");
    } catch (err) {
      console.error("Eroare la conectarea cu MongoDB:", err.message);
      process.exit(1);
    }
  };
  

module.exports = connectDB;
