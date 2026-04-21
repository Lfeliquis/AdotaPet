const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/users", UserController.createUser);
router.post("/login", UserController.login);

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/perfil", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
