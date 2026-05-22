const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/AdoptionController");

router.post("/adoptions", authMiddleware, createRequest);

router.get("/adoptions/my-requests", authMiddleware, getMyRequests);

router.get("/adoptions/received", authMiddleware, getReceivedRequests);

router.put("/adoptions/:id/approve", authMiddleware, approveRequest);

router.put("/adoptions/:id/reject", authMiddleware, rejectRequest);

module.exports = router;
