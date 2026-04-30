const mongoose = require("mongoose");
const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");

// Criar solicitação
const createRequest = async (req, res) => {
  try {
    const { petId, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(petId)) {
      return res.status(400).json({ message: "ID do pet inválido" });
    }

    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    if (pet.owner.toString() === req.userId) {
      return res.status(400).json({
        message: "Você não pode solicitar adoção do seu próprio pet",
      });
    }

    if (pet.status === "adopted") {
      return res.status(400).json({
        message: "Este pet já foi adotado",
      });
    }

    const existing = await AdoptionRequest.findOne({
      pet: petId,
      requester: req.userId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({
        message: "Você já solicitou a adoção deste pet",
      });
    }

    const request = await AdoptionRequest.create({
      pet: petId,
      requester: req.userId,
      owner: pet.owner,
      message: message?.trim() || "",
    });

    res.status(201).json({
      message: "Solicitação enviada com sucesso",
      request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Minhas solicitações
const getMyRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({
      requester: req.userId,
    })
      .populate("pet")
      .populate("owner", "name email");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Solicitações recebidas
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({
      owner: req.userId,
    })
      .populate("pet")
      .populate("requester", "name email");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Aprovar solicitação
const approveRequest = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Solicitação não encontrada" });
    }

    if (request.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Solicitação já foi processada",
      });
    }

    const pet = await Pet.findById(request.pet);

    if (!pet) {
      return res.status(404).json({ message: "Pet não encontrado" });
    }

    if (pet.status === "adopted") {
      return res.status(400).json({
        message: "Pet já foi adotado",
      });
    }

    request.status = "approved";
    await request.save();

    pet.status = "adopted";
    pet.adoptedBy = request.requester;
    pet.adoptedAt = new Date();
    await pet.save();

    await AdoptionRequest.updateMany(
      {
        pet: request.pet,
        _id: { $ne: request._id },
        status: "pending",
      },
      { status: "rejected" }
    );

    res.json({ message: "Solicitação aprovada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Rejeitar solicitação
const rejectRequest = async (req, res) => {
  try {
    const request = await AdoptionRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Solicitação não encontrada" });
    }

    if (request.owner.toString() !== req.userId) {
      return res.status(403).json({ message: "Acesso negado" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Solicitação já foi processada",
      });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Solicitação rejeitada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  approveRequest,
  rejectRequest,
};