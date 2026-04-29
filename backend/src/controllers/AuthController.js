const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// REGISTER
const register = async (req, res) => {
  const { name, email, senha } = req.body;

  try {
    // Verifica se já existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar usuário
    const user = await User.create({
      name,
      email,
      senha: hashedPassword,
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao cadastrar usuário" });
  }
};

// LOGIN
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

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
