const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  origem: {
    type: String,
    enum: ["atividade", "movimentacaoFinanceira"],
    required: true,
  },
  acao: {
    type: String,
    enum: ["conquistar", "comprar", "liquidar", "transferir"],
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  participante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participante",
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  valor: {
    type: Number,
    required: true,
  },
  tipoMovimentacao: {
    type: Number,
    enum: [1, -1],
    required: true,
  },
  status: {
    type: String,
    enum: ["pendente", "ativo", "recusado", "cancelado"],
    default: "pendente",
    required: true,
  },
  participanteInclusao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participante",
    required: true,
  },
  dataInclusao: {
    type: Date,
    default: Date.now,
  },
  participanteUltimaAlteracao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participante",
    required: false,
  },
  dataUltimaAlteracao: {
    type: Date,
    required: false,
  },
  compra: CompraSchema,
  liquidacao: LiquidaSchema,
  transferencia: TransferenciaSchema,
});

const Token = mongoose.model("Token", TokenSchema, "tokens");

module.exports = Token;
