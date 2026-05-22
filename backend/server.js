require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const petRoutes = require("./src/routes/pet.routes");
const adoptionRoutes = require("./src/routes/adoption.routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ROTAS
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", petRoutes);
app.use("/api", adoptionRoutes);

// BANCO
connectDB();

// TESTE
app.get("/", (req, res) => {
  res.send("API rodando");
});

// SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
