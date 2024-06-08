const express = require("express");
const TokensController = require("../controllers/tokensController");

const router = express.Router();

router.get("/saldo-participante", TokensController.saldoParticipante);
router.get("/saldo-total", TokensController.saldoTotal);
router.get("/cotacao", TokensController.cotacao);

module.exports = router;
