const mongoose = require("mongoose");

const getGrupoTrabalho = (identificador) => {
  if (mongoose.models[`${identificador}_GrupoTrabalho`])
    return mongoose.models[`${identificador}_GrupoTrabalho`];

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
      ref: `${identificador}_Participante`,
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
      required: true,
    },
    dataInclusao: {
      type: Date,
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
    `${identificador}_GrupoTrabalho`,
    GrupoTrabalhoSchema,
    `${identificador}_gruposTrabalho`
  );
};

module.exports = getGrupoTrabalho;
