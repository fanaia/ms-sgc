const express = require("express");
const participantesController = require("../controllers/participantesController");

const router = express.Router();
router.post("/", participantesController.create);
router.get("/", participantesController.readAll);
router.get("/:id", participantesController.readOne);
router.patch("/:id", participantesController.update);
router.delete("/:id", participantesController.delete);

module.exports = router;
