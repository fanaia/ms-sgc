const mongoose = require("mongoose");

const ProjetoSchema = new mongoose.Schema({
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

const Projeto = mongoose.model("Projeto", ProjetoSchema, "projetos");

module.exports = Projeto;
