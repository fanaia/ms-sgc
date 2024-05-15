const mongoose = require("mongoose");

const VotacaoSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["atividade", "movimentacaoFinanceira", "participante", "projeto", "votacao"],
    required: true,
  },
  acao: {
    type: String,
    enum: ["adicionar", "alterar", "bloquear"],
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  participante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Participante",
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  dataInicio: {
    type: Date,
    required: true,
  },
  dataTermino: {
    type: Date,
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
  votos: [
    {
      participante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Participante",
        required: true,
      },
      tokens: {
        type: Number,
        required: true,
      },
      voto: {
        type: Boolean,
        required: true,
      },
      dataInclusao: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Votacao = mongoose.model("Votacao", VotacaoSchema, "votacoes");

module.exports = Votacao;
