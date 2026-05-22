router.post(
  "/pets",
  authMiddleware,
  upload.single("image"),
  PetController.createPet,
);

router.get("/pets", PetController.getPets);

router.get("/my-pets", authMiddleware, PetController.getMyPets);

router.get("/my-adoptions", authMiddleware, PetController.getMyAdoptions);

router.get("/pets/:id", PetController.getPetById);

router.put(
  "/pets/:id",
  authMiddleware,
  upload.single("image"),
  PetController.updatePet,
);

router.delete("/pets/:id", authMiddleware, PetController.deletePet);

router.post("/pets/:id/adopt", authMiddleware, PetController.adoptPet);
