const mongoose = require("mongoose");

const ParticipanteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  whatsapp: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  documento: {
    type: String,
    required: true,
  },
  chavePix: {
    type: String,
    required: false,
  },
  tokenHora: {
    type: Number,
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
    required: true,
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

const Participante = mongoose.model("Participante", ParticipanteSchema, "participantes");

module.exports = Participante;
