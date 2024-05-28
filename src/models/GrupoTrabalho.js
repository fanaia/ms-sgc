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
  ativo: {
    type: Boolean,
    required: false,
  },
  participanteResponsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participante",
    required: true,
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

const GrupoTrabalho = mongoose.model("GrupoTrabalho", GrupoTrabalhoSchema, "gruposTrabalho");

module.exports = GrupoTrabalho;