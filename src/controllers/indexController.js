const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Participante = require("../models/Participante");
const Config = require("../models/Config");

class IndexController {
  static async test(req, res) {
    res.send({ status: "funcionando... (0.0.1)" });
  }

  static async createSeed(req, res) {
    const { contratoSocial, tokenNome, tokenSigla, liquidacaoMinima, participante } = req.body;

    console.log(req.body);

    const hasActiveParticipant = await Participante.findOne({ status: "ativo" });
    if (!hasActiveParticipant) {
      const configData = { contratoSocial, tokenNome, tokenSigla, liquidacaoMinima };
      await Config.findOneAndUpdate({}, configData, { upsert: true, new: true });

      const hashedPassword = participante.senha
        ? CryptoJS.SHA256(participante.senha).toString()
        : null;
      participante.senha = hashedPassword;
      participante.status = "ativo";
      participante.tokenHora = 1;
      await Participante.create(participante);

      return res.send("uma nova semente foi criada... seja bem vindo!");
    }

    return res.status(400).json("já existe uma seed criada...");
  }

  static async login(req, res) {
    const { whatsapp, senha } = req.body;
    const hashedPassword = CryptoJS.SHA256(senha).toString();
    const participante = await Participante.findOne({ whatsapp, senha: hashedPassword });

    if (!participante) return res.status(401).send("Dados inválidos");
    if (!participante.status === "ativo")
      return res.status(401).send("Status participante: " + participante.status);

    const tokenJwt = jwt.sign(
      {
        _id: participante._id,
        whatsapp: participante.whatsapp,
        senha: participante.senha,
        tokenHora: participante.tokenHora,
      },
      process.env.ACCESS_TOKEN_SECRET
    );
    participante.jwt = tokenJwt;
    await participante.save();
    res.send({ tokenJwt, nome: participante.nome, _id: participante._id });
  }
}

module.exports = IndexController;
