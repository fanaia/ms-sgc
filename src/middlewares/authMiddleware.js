const jwt = require("jsonwebtoken");
const Participante = require("../models/Participante");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });

    // console.log(`Participante: ${JSON.stringify(user)}`);
    const { _id, whatsapp, senha } = user;
    const participante = await Participante.findOne({ _id });

    if (!participante) return res.status(403).json({ error: "Participante não encontrado" });
    if (participante.whatsapp !== whatsapp || participante.senha !== senha)
      return res.status(403).json({ error: "Autenticação inválida" });
    if (!participante.ativo) return res.status(403).json({ error: "Participante desativado" });

    req.user = participante;
    next();
  });
};

module.exports = authMiddleware;
