const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Participante = require("../models/Participante");

class participantesController {
  static async create(req, res) {
    const updateData = req.body;
    if (!updateData.nome || updateData.nome == "") return res.status(400).send("Nome is required");
    if (!updateData.senha || updateData.senha == "")
      return res.status(400).send("Senha is required");

    if (updateData.senha) {
      const hashedPassword = updateData.senha ? CryptoJS.SHA256(updateData.senha).toString() : null;
      updateData.senha = hashedPassword;
    }

    const participante = new Participante(updateData);
    await participante.save();
    res.status(201).send(participante);
  }

  static async readAll(req, res) {
    const participantes = await Participante.find(req.query);
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
    const updateData = req.body;

    if (updateData.nome == "") return res.status(400).send("Nome is required");

    if (updateData.senha && updateData.senha.trim() !== "") {
      const hashedPassword = CryptoJS.SHA256(updateData.senha).toString();
      updateData.senha = hashedPassword;
    } else {
      delete updateData.senha;
    }

    const participante = await Participante.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!participante) {
      return res.status(404).send("Participante not found");
    }
    res.send(participante);
  }

  static async delete(req, res) {
    const participante = await Participante.findByIdAndDelete(req.params.id);
    if (!participante) {
      return res.status(404).send("Participante not found");
    }
    res.status(204).send();
  }
}

module.exports = participantesController;
