const mongoose = require("mongoose");

const MovimentacaoFinanceiraSchema = new mongoose.Schema({
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
  chavePixFatura: {
    type: String,
    required: false,
  },
  chavePixTransacao: {
    type: String,
    required: false,
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

const MovimentacaoFinanceira = mongoose.model(
  "MovimentacaoFinanceira",
  MovimentacaoFinanceiraSchema,
  "movimentacoesFinanceiras"
);

module.exports = MovimentacaoFinanceira;
