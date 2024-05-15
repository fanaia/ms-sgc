const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["atividade", "movimentacaoFinanceira", "participante"],
    required: true,
  },
  acao: {
    type: String,
    enum: ["adicionar", "comprar", "liquidar", "transferir"],
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
  ativo: {
    type: Boolean,
    required: false,
  },
  dataInclusao: {
    type: Date,
    default: Date.now,
  },
  dataAlteracao: {
    type: Date,
    default: Date.now,
  },
});

const Token = mongoose.model("Token", TokenSchema, "tokens");

module.exports = Token;
