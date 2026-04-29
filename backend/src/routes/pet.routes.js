const express = require("express");
const router = express.Router();
const PetController = require("../controllers/PetController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  PetController.createPet,
);

router.get("/", PetController.getPets);

router.get("/my-pets", authMiddleware, PetController.getMyPets);

router.get("/my-adoptions", authMiddleware, PetController.getMyAdoptions);

router.get("/:id", PetController.getPetById);

router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  PetController.updatePet,
);

router.delete("/:id", authMiddleware, PetController.deletePet);

router.post("/:id/adopt", authMiddleware, PetController.adoptPet);

module.exports = router;
