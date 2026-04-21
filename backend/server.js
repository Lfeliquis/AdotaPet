require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const userRoutes = require("./src/routes/user.routes");
const petRoutes = require("./src/routes/pet.routes");
const adoptionRoutes = require("./src/routes/adoption.routes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", petRoutes);
app.use("/api", adoptionRoutes);

// Conexão com banco
connectDB();

// Rota teste
app.get("/", (req, res) => {
  res.send("API rodando ");
});

// Subir servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
