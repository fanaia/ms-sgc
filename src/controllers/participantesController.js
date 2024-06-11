const CryptoJS = require("crypto-js");
const getParticipante = require("../models/Participante");
const getGrupoTrabalho = require("../models/GrupoTrabalho");
const getProjeto = require("../models/Projeto");
class participantesController {
  static async save(req, res) {
    try {
      const Participante = getParticipante(req.identificador);
      const updateData = req.body;

      if (updateData.senha) {
        const hashedPassword = updateData.senha
          ? CryptoJS.SHA256(updateData.senha).toString()
          : null;
        updateData.senha = hashedPassword;
      }

      const count = await Participante.countDocuments({ status: "ativo" });
      updateData.status = count === 1 ? "ativo" : "pendente";

      updateData.participanteUltimaAlteracao = req.user.id;
      updateData.dataUltimaAlteracao = new Date();

      let participante;
      if (req.params.id) {
        participante = await Participante.findByIdAndUpdate(req.params.id, updateData, {
          new: true,
        });
        if (!participante) {
          return res.status(404).send("No participante found with given id");
        }
      } else {
        if (!updateData.senha || updateData.senha == "")
          return res.status(400).send("Senha is required");

        updateData.participanteInclusao = req.user.id;
        updateData.dataInclusao = new Date();

        participante = new Participante(updateData);
      }

      await participante.save();
      res.status(201).send(participante);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async readAll(req, res) {
    const Participante = getParticipante(req.identificador);
    const GrupoTrabalho = getGrupoTrabalho(req.identificador);
    const Projeto = getProjeto(req.identificador);

    const participantes = await Participante.find(req.query).select("-senha").sort("nome");

    const participantesWithCounts = await Promise.all(
      participantes.map(async (participante) => {
        const gruposTrabalhoCount = await GrupoTrabalho.countDocuments({
          participanteResponsavel: participante._id,
          status: "ativo",
        });

        const projetosCount = await Projeto.countDocuments({
          participanteResponsavel: participante._id,
          status: "ativo",
        });
        const pesoConsenso = gruposTrabalhoCount + projetosCount;

        return {
          ...participante._doc,
          pesoConsenso,
        };
      })
    );

    res.send(participantesWithCounts);
  }

  static async readOne(req, res) {
    const Participante = getParticipante(req.identificador);
    const participante = await Participante.findById(req.params.id);
    if (!participante) {
      return res.status(404).send("Participante not found");
    }
    res.send(participante);
  }

  static async delete(req, res) {
    const Participante = getParticipante(req.identificador);
    const participante = await Participante.findById(req.params.id);
    if (!participante) {
      return res.status(404).send("Participante not found");
    }

    participante.status = "cancelado";
    participante.participanteUltimaAlteracao = req.user.id;
    participante.dataUltimaAlteracao = new Date();

    await participante.save();
    res.status(204).send();
  }

  static async approve(req, res) {
    const Participante = getParticipante(req.identificador);
    const GrupoTrabalho = getGrupoTrabalho(req.identificador);

    try {
      const grupoTrabalhoCount = await GrupoTrabalho.aggregate([
        { $match: { status: "ativo" } },
        { $group: { _id: "$participanteResponsavel", count: { $sum: 1 } } },
      ]);

      if (grupoTrabalhoCount.length > 0) {
        const grupoTrabalho = await GrupoTrabalho.findOne({ participanteResponsavel: req.user.id });
        if (!grupoTrabalho) {
          return res.status(403).send("Somente responsáveis por GT podem fazer aprovação");
        }
      }
      const participante = await Participante.findById(req.params.id);
      if (!participante) {
        return res.status(404).send("Participante não encontrado");
      }

      if (
        req.user.id == participante.participanteUltimaAlteracao._id &&
        req.params.approve === "true" &&
        grupoTrabalhoCount.length > 1
      ) {
        return res.status(403).send("Não é possível aprovar a própria alteração");
      }

      participante.status = req.params.approve === "true" ? "ativo" : "recusado";

      participante.participanteUltimaAlteracao = req.user.id;
      participante.dataUltimaAlteracao = new Date();

      await participante.save();
      res.status(200).send(participante);
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  }
}

module.exports = participantesController;
