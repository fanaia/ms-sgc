const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const Participante = require("../models/Participante");

class IndexController {
  static async test(req, res) {
    res.send({ status: "funcionando..." });
  }

  static async login(req, res) {
    const { whatsapp, senha } = req.body;
    const hashedPassword = CryptoJS.SHA256(senha).toString();
    const participante = await Participante.findOne({ whatsapp, senha: hashedPassword });

    if (!participante) return res.status(401).send({ message: "Invalid credentials" });
    if (!participante.ativo) return res.status(401).send({ message: "Account is not active" });

    const token = jwt.sign(
      { _id: participante._id, whatsapp: participante.whatsapp, senha: participante.senha },
      process.env.ACCESS_TOKEN_SECRET
    );
    participante.jwt = token;
    await participante.save();
    res.send({ token });
  }
}

module.exports = IndexController;
