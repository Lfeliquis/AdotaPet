const express = require("express");
const router = express.Router();

const PetController = require("../controllers/PetController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// ROTAS GERAIS
router.get("/pets", PetController.getPets);

router.get("/my-pets", authMiddleware, PetController.getMyPets);

router.get("/my-adoptions", authMiddleware, PetController.getMyAdoptions);

// ROTAS POR ID
router.get("/pets/:id", PetController.getPetById);

// CRIAR
router.post(
  "/pets",
  authMiddleware,
  upload.single("image"),
  PetController.createPet,
);

// EDITAR
router.put(
  "/pets/:id",
  authMiddleware,
  upload.single("image"),
  PetController.updatePet,
);

// DELETAR
router.delete("/pets/:id", authMiddleware, PetController.deletePet);

// ADOÇÃO
router.post("/pets/:id/adopt", authMiddleware, PetController.adoptPet);

module.exports = router;
