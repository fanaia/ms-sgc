const MovimentacaoFinanceira = require("../models/MovimentacaoFinanceira");

class movimentacoesFinanceirasController {
  static async create(req, res) {
    let updateData = req.body;
    if (!updateData.valor || updateData.valor == "")
      return res.status(400).send("Valor is required");

    updateData.participanteInclusao = req.user.id;
    updateData.dataInclusao = new Date();

    const movimentacao = new MovimentacaoFinanceira(updateData);
    await movimentacao.save();
    res.status(201).send(movimentacao);
  }

  static async readAll(req, res) {
    const movimentacoes = await MovimentacaoFinanceira.find(req.query)
      .populate("participante", "nome")
      .populate("grupoTrabalho", "nome corEtiqueta")
      .populate("projeto", "nome corEtiqueta");
    res.send(movimentacoes);
  }

  static async readOne(req, res) {
    const movimentacao = await MovimentacaoFinanceira.findById(req.params.id);
    if (!movimentacao) {
      return res.status(404).send("Movimentacao not found");
    }
    res.send(movimentacao);
  }

  static async update(req, res) {
    const updateData = req.body;

    if (updateData.valor == "")
      return res.status(400).send("Valor is required");

    updateData.participanteUltimaAlteracao = req.user.id;
    updateData.dataUltimaAlteracao = new Date();

    const movimentacao = await MovimentacaoFinanceira.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );
    if (!movimentacao) {
      return res.status(404).send("Movimentacao not found");
    }
    res.send(movimentacao);
  }

  static async delete(req, res) {
    const movimentacao = await MovimentacaoFinanceira.findById(req.params.id);
    if (!movimentacao) {
      return res.status(404).send("Movimentacao not found");
    }

    grupoTrabalho.status = "cancelado";
    grupoTrabalho.participanteUltimaAlteracao = req.user.id;
    grupoTrabalho.dataUltimaAlteracao = new Date();

    await grupoTrabalho.save();
    res.status(204).send();
  }
}

module.exports = movimentacoesFinanceirasController;
