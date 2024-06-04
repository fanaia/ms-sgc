const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Participante = require("../models/Participante");

class participantesController {
  static async create(req, res) {
    try {
      const updateData = req.body;
      if (!updateData.nome || updateData.nome == "")
        return res.status(400).send("Nome is required");
      if (!updateData.senha || updateData.senha == "")
        return res.status(400).send("Senha is required");

      if (updateData.senha) {
        const hashedPassword = updateData.senha
          ? CryptoJS.SHA256(updateData.senha).toString()
          : null;
        updateData.senha = hashedPassword;
      }

      updateData.participanteInclusao = req.user.id;
      updateData.dataInclusao = new Date();

      const participante = new Participante(updateData);
      await participante.save();
      res.status(201).send(participante);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async readAll(req, res) {
    const participantes = await Participante.find(req.query).select("-senha").sort("nome");
    res.send(participantes);
  }

  static async readOne(req, res) {
    const participante = await Participante.findById(req.params.id);
    if (!participante) {
      return res.status(404).send("Participante not found");
    }
    res.send(participante);
  }

  static async update(req, res) {
    try {
      const updateData = req.body;

      if (updateData.nome == "") return res.status(400).send("Nome is required");

      if (updateData.senha && updateData.senha.trim() !== "") {
        const hashedPassword = CryptoJS.SHA256(updateData.senha).toString();
        updateData.senha = hashedPassword;
      } else {
        delete updateData.senha;
      }

      updateData.participanteUltimaAlteracao = req.user.id;
      updateData.dataUltimaAlteracao = new Date();

      const participante = await Participante.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });
      if (!participante) {
        return res.status(404).send("Participante not found");
      }

      res.send(participante);
    } catch (err) {
      res.status(400).send(err.message);
    }
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
}

module.exports = participantesController;
