const mongoose = require("mongoose");

const GrupoTrabalhoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: false,
  },
  corEtiqueta: {
    type: String,
    required: false,
  },
  participanteResponsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participante",
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
});

const getGrupoTrabalho = (contratoSocial) => {
  return mongoose.model(
    `${contratoSocial}_GrupoTrabalho`,
    GrupoTrabalhoSchema,
    `${contratoSocial}_gruposTrabalho`
  );
};

module.exports = getGrupoTrabalho;
