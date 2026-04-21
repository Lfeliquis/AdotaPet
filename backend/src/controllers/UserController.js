const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      return res.status(400).json({
        message: "Usuário já cadastrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("ERRO CREATE USER:", error);
    return res.status(500).json({
      message: "Erro ao criar usuário",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email e senha são obrigatórios",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado",
      });
    }

    if (!user.password) {
      return res.status(500).json({
        message: "Senha do usuário não encontrada",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET não configurado no .env",
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Senha inválida",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("ERRO LOGIN:", error);
    return res.status(500).json({
      message: "Erro no login",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  login,
};
