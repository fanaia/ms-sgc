const mongoose = require("mongoose");

const AtividadeSchema = new mongoose.Schema({
  participante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participante",
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
  dataRealizacao: {
    type: Date,
    default: Date.now,
    required: true,
  },
  totalHoras: {
    type: Number,
    required: true,
  },
  totalTokens: {
    type: Number,
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

const Atividade = mongoose.model("Atividade", AtividadeSchema, "atividades");

module.exports = Atividade;
