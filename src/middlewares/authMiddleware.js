const jwt = require("jsonwebtoken");
const getParticipante = require("../models/Participante");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const identificador = req.headers["identificador"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.status(401).json({ error: "Token não fornecido" });
  if (identificador == null) return res.status(401).json({ error: "Identificador é obrigatório" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });

    const { _id, whatsapp, senha } = user;
    const Participante = await getParticipante(identificador);
    const participante = await Participante.findOne({ _id });

    if (!participante) return res.status(403).json({ error: "Participante não encontrado" });
    if (participante.whatsapp !== whatsapp || participante.senha !== senha)
      return res.status(403).json({ error: "Autenticação inválida" });
    if (participante.status !== "ativo")
      return res.status(403).json({ error: "Status Participante: " + participante.status });

    req.user = participante;
    req.identificador = identificador;
    next();
  });
};

module.exports = authMiddleware;
