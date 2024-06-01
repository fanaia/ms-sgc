require("express-async-errors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");

const connectDB = require("./config/db");
const logger = require("./providers/logger");
const authMiddleware = require("./middlewares/authMiddleware");

const indexRouter = require("./routers/indexRouter");
const atividadesRouter = require("./routers/atividadesRouter");
const projetosRouter = require("./routers/projetosRouter");
const participantesRouter = require("./routers/participantesRouter");
const gruposTrabalhoRouter = require("./routers/gruposTrabalhoRouter");
const movimentacoesFinanceirasRouter = require("./routers/movimentacoesFinanceirasRouter");

let server = null;

const start = async () => {
  connectDB();
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.use("/api", indexRouter);
  app.use("/api/atividades", authMiddleware, atividadesRouter);
  app.use("/api/projetos", authMiddleware, projetosRouter);
  app.use("/api/grupos-trabalho", authMiddleware, gruposTrabalhoRouter);
  app.use("/api/participantes", authMiddleware, participantesRouter);
  // app.use("/api/participantes", participantesRouter);
  app.use("/api/movimentacoes-financeiras", authMiddleware, movimentacoesFinanceirasRouter);

  app.use((error, req, res, next) => {
    logger.error(`${error.stack}`);
    res.status(500).send("Erro interno no servidor");
  });

  server = app.listen(process.env.PORT, () => {
    console.log(`Serviço ${process.env.SERVICE_NAME} subiu na porta ${process.env.PORT}`);
  });

  return server;
};

const stop = async () => {
  if (server) await server.close();
  return true;
};

module.exports = { start, stop };
