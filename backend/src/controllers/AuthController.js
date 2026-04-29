const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const register = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const userExistente = await User.findOne({ email });

    if (userExistente) {
      return res.status(400).json({ message: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUser = await User.create({
      email,
      senha: senhaHash,
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: novoUser._id,
        email: novoUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    // GERAR TOKEN
    const token = jwt.sign(
      { id: user._id }, // payload
      process.env.JWT_SECRET, // chave secreta
      { expiresIn: "1d" }, // tempo de expiração
    );

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor" });
  }
};

module.exports = { register, login };
