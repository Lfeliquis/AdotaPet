const express = require("express");
const router = express.Router();
const AdoptionController = require("../controllers/AdoptionController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post(
  "/adoption-requests",
  authMiddleware,
  AdoptionController.createRequest,
);
router.get("/my-requests", authMiddleware, AdoptionController.getMyRequests);
router.get(
  "/received-requests",
  authMiddleware,
  AdoptionController.getReceivedRequests,
);
router.put(
  "/adoption-requests/:id/approve",
  authMiddleware,
  AdoptionController.approveRequest,
);
router.put(
  "/adoption-requests/:id/reject",
  authMiddleware,
  AdoptionController.rejectRequest,
);

module.exports = router;
