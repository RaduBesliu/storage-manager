const express = require("express");
const router = express.Router();
const User = require("../models/User");
const checkSuperAdmin = require("../middleware/checkRole");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Eroare la obtinerea utilizatorilor.", error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const newUser = new User({ name, email, role });
    await newUser.save();
    res.status(201).json({ message: "Utilizator creat cu succes.", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Eroare la creare", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilizatorul nu e gasit" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Eroare la obtinere", error: err.message });
  }
});

module.exports = router;




router.put("/assign-role/:id", async (req, res) => {
  const { role } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Utilizator negasit" });
    }

    if (!["Super Admin", "Store Admin", "Store Employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid rol" });
    }

    user.role = role;
    await user.save();
    res.json({ message: "Rol atribuit cu succes", user });
  } catch (err) {
    res.status(500).json({ message: "Eroare", error: err.message });
  }
});

  
  router.put("/update-user/:id", checkSuperAdmin, async (req, res) => {
    const { name, email, role } = req.body;
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilizatorul nu a fost gasit." });
      }
  
      if (role && !["Super Admin", "Store Admin", "Store Employee"].includes(role)) {
        return res.status(400).json({ message: "Rol invalid." });
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
  
      await user.save();
      res.json({ message: "Utilizatorul a fost actualizat.", user });
    } catch (err) {
      res.status(500).json({ message: "Eroare la actualizare.", error: err.message });
    }
  });

  router.delete("/delete-user/:id", checkSuperAdmin, async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilizatorul nu a fost gasit." });
      }
  
      res.json({ message: "Utilizatorul a fost sters cu succes.", user });
    } catch (err) {
      res.status(500).json({ message: "Eroare la stergerea utilizatorului.", error: err.message });
    }
  });
  