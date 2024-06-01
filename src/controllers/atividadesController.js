const Atividade = require("../models/Atividade");

class atividadesController {
  static async create(req, res) {
    const updateData = req.body;
    if (!updateData.descricao || updateData.descricao == "")
      return res.status(400).send("Descricao is required");

    // Set participanteInclusao to the participant ID from the request token
    updateData.participante = req.user.id;
    updateData.participanteInclusao = req.user.id;

    // Set dataInclusao to the current date
    updateData.dataInclusao = new Date();

    const atividade = new Atividade(updateData);
    await atividade.save();
    res.status(201).send(atividade);
  }

  static async readAll(req, res) {
    const atividades = await Atividade.find(req.query);
    res.send(atividades);
  }

  static async readOne(req, res) {
    const atividade = await Atividade.findById(req.params.id);
    if (!atividade) {
      return res.status(404).send("Atividade not found");
    }
    res.send(atividade);
  }

  static async update(req, res) {
    const updateData = req.body;
    if (updateData.descricao == "") return res.status(400).send("Descricao is required");

    updateData.participanteUltimaAlteracao = req.user.id;
    updateData.dataUltimaAlteracao = new Date();

    const atividade = await Atividade.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!atividade) {
      return res.status(404).send("Atividade not found");
    }
    res.send(atividade);
  }

  static async delete(req, res) {
    const atividade = await Atividade.findById(req.params.id);
    if (!atividade) {
      return res.status(404).send("Atividade not found");
    }

    // Set status to 'cancelado'
    atividade.status = "cancelado";

    // Set participanteUltimaAlteracao to the participant ID from the request token
    atividade.participanteUltimaAlteracao = req.user.id;

    // Set dataUltimaAlteracao to the current date
    atividade.dataUltimaAlteracao = new Date();

    await atividade.save();

    res.status(204).send();
  }
}

module.exports = atividadesController;
