const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

//Rota pública
router.post("/login", AuthController.login);

//Rota protegida
router.get("/perfil", authMiddleware, (req, res) => {
  res.json({
    message: "Usuário autenticado",
    userId: req.userId,
  });
});

module.exports = router;
