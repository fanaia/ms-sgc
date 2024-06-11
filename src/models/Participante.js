const mongoose = require("mongoose");

const getParticipante = (identificador) => {
  if (mongoose.models[`${identificador}_Participante`])
    return mongoose.models[`${identificador}_Participante`];

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
      required: false,
    },
    senha: {
      type: String,
      required: true,
    },
    documento: {
      type: String,
      required: false,
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
      ref: `${identificador}_Participante`,
      required: false,
    },
    dataInclusao: {
      type: Date,
      required: true,
      default: Date.now,
    },
    participanteUltimaAlteracao: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `${identificador}_Participante`,
      required: false,
    },
    dataUltimaAlteracao: {
      type: Date,
      required: false,
    },
  });

  return mongoose.model(
    `${identificador}_Participante`,
    ParticipanteSchema,
    `${identificador}_participantes`
  );
};

module.exports = getParticipante;
