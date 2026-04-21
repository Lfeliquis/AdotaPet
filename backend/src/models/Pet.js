const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: Number,
    species: String,
    breed: String,
    description: String,

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["available", "adopted"],
      default: "available",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    adoptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    adoptedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Pet", PetSchema);
