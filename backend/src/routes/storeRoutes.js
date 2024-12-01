const express = require("express");
const router = express.Router();
const Store = require("../models/Store");

router.get("/", async (req, res) => {
  try {
    const stores = await Store.find();
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: "Eroare la obtinerea magazinelor." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, location } = req.body;
    const newStore = new Store({ name, location });
    await newStore.save();
    res.status(201).json(newStore);
  } catch (err) {
    res.status(500).json({ message: "Eroare la crearea magazinului." });
  }
});

module.exports = router;
