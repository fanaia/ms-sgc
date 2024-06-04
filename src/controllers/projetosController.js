const Projeto = require("../models/Projeto");

class projetosController {
  static async create(req, res) {
    try {
      const updateData = req.body;
      if (!updateData.nome || updateData.nome == "")
        return res.status(400).send("Nome is required");

      updateData.participanteInclusao = req.user.id;
      updateData.dataInclusao = new Date();

      const projeto = new Projeto(updateData);
      await projeto.save();
      res.status(201).send(projeto);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async readAll(req, res) {
    const projetos = await Projeto.find(req.query)
      .populate("participanteResponsavel", "nome")
      .sort("nome");
    res.send(projetos);
  }

  static async readOne(req, res) {
    const projeto = await Projeto.findById(req.params.id);
    if (!projeto) {
      return res.status(404).send("Projeto not found");
    }
    res.send(projeto);
  }

  static async update(req, res) {
    try {
      const updateData = req.body;
      if (updateData.nome == "") return res.status(400).send("Nome is required");

      updateData.participanteUltimaAlteracao = req.user.id;
      updateData.dataUltimaAlteracao = new Date();

      const projeto = await Projeto.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!projeto) {
        return res.status(404).send("Projeto not found");
      }

      res.send(projeto);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async delete(req, res) {
    const projeto = await Projeto.findById(req.params.id);
    if (!projeto) {
      return res.status(404).send("Projeto not found");
    }

    participante.status = "cancelado";
    participante.participanteUltimaAlteracao = req.user.id;
    participante.dataUltimaAlteracao = new Date();

    res.status(204).send();
  }
}

module.exports = projetosController;
