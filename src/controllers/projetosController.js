const Projeto = require("../models/Projeto");

class projetosController {
  static async create(req, res) {
    const updateData = req.body;
    if (!updateData.nome || updateData.nome == "") return res.status(400).send("Nome is required");

    const projeto = new Projeto(updateData);
    await projeto.save();
    res.status(201).send(projeto);
  }

  static async readAll(req, res) {
    const projetos = await Projeto.find(req.query);
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
    const updateData = req.body;
    if (updateData.nome == "") return res.status(400).send("Nome is required");

    const projeto = await Projeto.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!projeto) {
      return res.status(404).send("Projeto not found");
    }
    res.send(projeto);
  }

  static async delete(req, res) {
    const projeto = await Projeto.findByIdAndDelete(req.params.id);
    if (!projeto) {
      return res.status(404).send("Projeto not found");
    }
    res.status(204).send();
  }
}

module.exports = projetosController;
