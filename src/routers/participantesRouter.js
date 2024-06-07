const express = require("express");
const participantesController = require("../controllers/participantesController");

const router = express.Router();
router.post("/", participantesController.save);
router.get("/", participantesController.readAll);
router.get("/:id", participantesController.readOne);
router.patch("/:id", participantesController.save);
router.delete("/:id", participantesController.delete);
router.put("/:id/approve/:approve", participantesController.approve);

module.exports = router;
