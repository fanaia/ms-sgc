 const MovimentacaoFinanceira = require("../models/MovimentacaoFinanceira");

class movimentacoesFinanceirasController {
  static async create(req, res) {
    let updateData = req.body;
    if (!updateData.valor || updateData.valor == "") return res.status(400).send("Valor is required");
    
    const movimentacao = new MovimentacaoFinanceira(updateData);
    await movimentacao.save();
    res.status(201).send(movimentacao);
  }

  static async readAll(req, res) {
    const movimentacoes = await MovimentacaoFinanceira.find(req.query);
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

    if (updateData.valor == "") return res.status(400).send("Valor is required");

    const movimentacao = await MovimentacaoFinanceira.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!movimentacao) {
      return res.status(404).send("Movimentacao not found");
    }
    res.send(movimentacao);
  }

  static async delete(req, res) {
    const movimentacao = await MovimentacaoFinanceira.findByIdAndDelete(req.params.id);
    if (!movimentacao) {
      return res.status(404).send("Movimentacao not found");
    }
    res.status(204).send();
  }
}

module.exports = movimentacoesFinanceirasController;