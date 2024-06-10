const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
  identificador: {
    type: String,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  tokenSigla: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length === 3;
      },
      message: (props) => `${props.value} precisa de exatamente 3 characters!`,
    },
  },
  liquidacaoMinima: {
    type: Number,
    required: true,
  },
  ativarEstagioParticipante: {
    type: Boolean,
    required: true,
  },
});

const getConfig = (contratoSocial) => {
  return mongoose.model(
    `${contratoSocial}_Config`,
    ConfigSchema,
    `${contratoSocial}_configuracoes`
  );
};

module.exports = getConfig;
