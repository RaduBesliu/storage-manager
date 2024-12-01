const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");


dotenv.config(); 

const app = express();

app.use(express.json());

connectDB();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server ruleaza - conectat");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serverul ruleaza: port ${PORT}`));

const storeRoutes = require("./routes/storeRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/stores", storeRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));

