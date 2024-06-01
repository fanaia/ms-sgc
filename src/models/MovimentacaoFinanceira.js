const mongoose = require("mongoose");

const MovimentacaoFinanceiraSchema = new mongoose.Schema({
  participante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participante",
    required: true,
  },
  grupoTrabalho: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GrupoTrabalho",
    required: true,
  },
  projeto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projeto",
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
  destino : {
    type: String,
    required: true,
  },
  origem : {
    type: String,
    required: true,
  },
  chavePixTransacao: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["pendente", "ativo", "recusado", "cancelado"],
    default: "pendente",
    required: true,
  },
  dataTransação: {
    type: Date,
    default: Date.now,
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
