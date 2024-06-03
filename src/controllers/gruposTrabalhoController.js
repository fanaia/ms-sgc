const GrupoTrabalho = require("../models/GrupoTrabalho");

class grupoTrabalhosController {
  static async create(req, res) {
    const updateData = req.body;
    if (!updateData.nome || updateData.nome == "") return res.status(400).send("Nome is required");

    updateData.participanteInclusao = req.user.id;
    updateData.dataInclusao = new Date();

    const grupoTrabalho = new GrupoTrabalho(updateData);
    await grupoTrabalho.save();
    res.status(201).send(grupoTrabalho);
  }

  static async readAll(req, res) {
    const gruposTrabalho = await GrupoTrabalho.find(req.query).populate(
      "participanteResponsavel",
      "nome"
    );
    res.send(gruposTrabalho);
  }

  static async readOne(req, res) {
    const grupoTrabalho = await GrupoTrabalho.findById(req.params.id);
    if (!grupoTrabalho) {
      return res.status(404).send("Grupo de Trabalho not found");
    }
    res.send(grupoTrabalho);
  }

  static async update(req, res) {
    const updateData = req.body;
    if (updateData.nome == "") return res.status(400).send("Nome is required");

    updateData.participanteUltimaAlteracao = req.user.id;
    updateData.dataUltimaAlteracao = new Date();

    const grupoTrabalho = await GrupoTrabalho.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!grupoTrabalho) {
      return res.status(404).send("Grupo de Trabalho not found");
    }
    res.send(grupoTrabalho);
  }

  static async delete(req, res) {
    const grupoTrabalho = await GrupoTrabalho.findById(req.params.id);
    if (!grupoTrabalho) {
      return res.status(404).send("Grupo de Trabalho not found");
    }

    grupoTrabalho.status = "cancelado";
    grupoTrabalho.participanteUltimaAlteracao = req.user.id;
    grupoTrabalho.dataUltimaAlteracao = new Date();

    await grupoTrabalho.save();

    res.status(204).send();
  }
}

module.exports = grupoTrabalhosController;
