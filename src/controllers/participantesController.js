const CryptoJS = require("crypto-js");
const Participante = require("../models/Participante");
const GrupoTrabalho = require("../models/GrupoTrabalho");
const Projeto = require("../models/Projeto");
class participantesController {
  static async save(req, res) {
    try {
      const updateData = req.body;
      if (!updateData.nome || updateData.nome == "")
        return res.status(400).send("Nome is required");

      if (updateData.senha) {
        const hashedPassword = updateData.senha
          ? CryptoJS.SHA256(updateData.senha).toString()
          : null;
        updateData.senha = hashedPassword;
      }

      updateData.participanteInclusao = req.user.id;
      updateData.dataInclusao = new Date();
      updateData.status = "pendente";

      let participante;
      if (req.params.id) {
        updateData.participanteUltimaAlteracao = req.user.id;
        updateData.dataUltimaAlteracao = new Date();

        participante = await Participante.findByIdAndUpdate(req.params.id, updateData, {
          new: true,
        });
        if (!participante) {
          return res.status(404).send("No participante found with given id");
        }
      } else {
        if (!updateData.senha || updateData.senha == "")
          return res.status(400).send("Senha is required");

        participante = new Participante(updateData);
      }

      await participante.save();
      res.status(201).send(participante);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async readAll(req, res) {
    const participantes = await Participante.find(req.query).select("-senha").sort("nome");

    const participantesWithCounts = await Promise.all(
      participantes.map(async (participante) => {
        const gruposTrabalhoCount = await GrupoTrabalho.countDocuments({
          participanteResponsavel: participante._id,
        });
        const projetosCount = await Projeto.countDocuments({
          participanteResponsavel: participante._id,
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
    const participante = await Participante.findById(req.params.id);
    if (!participante) {
      return res.status(404).send("Participante not found");
    }
    res.send(participante);
  }

  static async delete(req, res) {
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
    try {
      const grupoTrabalho = await GrupoTrabalho.findOne({ participanteResponsavel: req.user.id });
      if (!grupoTrabalho) {
        return res.status(403).send("Somente responsáveis por GT podem fazer aprovação");
      }

      const participante = await Participante.findById(req.params.id);
      if (!participante) {
        return res.status(404).send("Participante não encontrado");
      }

      if (
        req.user.id == participante.participanteUltimaAlteracao._id &&
        req.params.approve === "true"
      ) {
        return res.status(403).send("Não é possível aprovar a própria alteração");
      }

      participante.status = req.params.approve === "true" ? "ativo" : "recusado";

      participante.participanteUltimaAlteracao = req.user.id;
      participante.dataUltimaAlteracao = new Date();

      await participante.save();
      res.status(200).send(participante);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
}

module.exports = participantesController;
