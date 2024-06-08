const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema({
  contratoSocial: {
    type: String,
    required: true,
  },
  tokenNome: {
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
});

const Config = mongoose.model("Config", ConfigSchema, "configuracoes");

module.exports = Config;
