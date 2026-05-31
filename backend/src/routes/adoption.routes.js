const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/AdoptionController");

router.post("/adoptions", authMiddleware, createRequest);

router.get("/adoptions/my-requests", authMiddleware, getMyRequests);

router.get(
  "/adoptions/received",
  authMiddleware,
  adminMiddleware,
  getReceivedRequests,
);

router.put(
  "/adoptions/:id/approve",
  authMiddleware,
  adminMiddleware,
  approveRequest,
);

router.put(
  "/adoptions/:id/reject",
  authMiddleware,
  adminMiddleware,
  rejectRequest,
);

module.exports = router;
