const mongoose = require("mongoose");

const MovimentacaoFinanceiraSchema = new mongoose.Schema({
  origem: {
    type: String,
    enum: ["atividade", "movimentacaoFinanceira"],
    required: true,
  },
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
  destino: {
    type: String,
    required: true,
  },
  origem: {
    type: String,
    required: true,
  },
  chavePixTransacao: {
    type: String,
    required: false,
  },
  dataTransacao: {
    type: Date,
    default: Date.now,
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
});

const MovimentacaoFinanceira = mongoose.model(
  "MovimentacaoFinanceira",
  MovimentacaoFinanceiraSchema,
  "movimentacoesFinanceiras"
);

module.exports = MovimentacaoFinanceira;
