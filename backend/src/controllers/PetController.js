const Pet = require("../models/Pet");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const mongoose = require("mongoose");
const AdoptionRequest = require("../models/AdoptionRequest");

// Upload para Cloudinary
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "adotapet" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// Criar pet
exports.createPet = async (req, res) => {
  try {
    const { name, age, species, breed, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    let imageUrl = "";

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      imageUrl = uploaded.secure_url;
    }

    const pet = await Pet.create({
      name,
      age,
      species,
      breed,
      description,
      image: imageUrl,
      owner: req.userId,
    });

    res.status(201).json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar pet", error: err.message });
  }
};

// Atualizar pet
exports.updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    if (pet.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer);
      pet.image = uploaded.secure_url;
    }

    pet.name = req.body.name || pet.name;
    pet.age = req.body.age || pet.age;
    pet.species = req.body.species || pet.species;
    pet.breed = req.body.breed || pet.breed;
    pet.description = req.body.description || pet.description;

    await pet.save();

    res.json(pet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao atualizar pet" });
  }
};

// Listar pets
exports.getPets = async (req, res) => {
  const pets = await Pet.find();
  res.json(pets);
};

// Buscar pet por ID
exports.getPetById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const pet = await Pet.findById(req.params.id)
      .populate("owner", "name email")
      .populate("adoptedBy", "name email");

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    res.json(pet);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar pet" });
  }
};

// Deletar pet
// Deletar pet (com exclusão das solicitações)
exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    if (pet.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    // Primeiro, excluímos as solicitações ligadas a este pet
    await AdoptionRequest.deleteMany({ pet: pet._id });

    // Em seguida, excluímos o pet
    await pet.deleteOne();

    res.json({ message: "Pet e solicitações deletados com sucesso" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erro ao deletar pet", error: err.message });
  }
};

// Meus pets
exports.getMyPets = async (req, res) => {
  const pets = await Pet.find({ owner: req.userId });
  res.json(pets);
};

// Minhas adoções
exports.getMyAdoptions = async (req, res) => {
  const pets = await Pet.find({ adoptedBy: req.userId });
  res.json(pets);
};

// Adotar pet
exports.adoptPet = async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (pet.owner.toString() === req.userId) {
    return res.status(400).json({
      message: "Você não pode adotar seu próprio pet",
    });
  }

  pet.status = "adopted";
  pet.adoptedBy = req.userId;
  pet.adoptedAt = new Date();

  await pet.save();

  res.json(pet);
};
