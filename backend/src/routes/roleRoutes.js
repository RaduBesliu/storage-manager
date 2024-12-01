const express = require("express");
const router = express.Router();
const Role = require("../models/Role");

// Obtine toate rolurile
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: "Eroare la obținerea rolurilor." });
  }
});

// Creeaza un rol nou
router.post("/", async (req, res) => {
  try {
    const { role, permissions } = req.body;
    const newRole = new Role({ role, permissions });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ message: "Eroare la crearea rolului." });
  }
});

module.exports = router;
