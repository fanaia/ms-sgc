const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Participante = require("../models/Participante");

class IndexController {
  static async test(req, res) {
    res.send({ status: "funcionando... (a)" });
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
