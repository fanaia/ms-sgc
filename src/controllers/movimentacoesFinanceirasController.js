const MovimentacaoFinanceira = require("../models/MovimentacaoFinanceira");

class movimentacoesFinanceirasController {
  static async create(req, res) {
    try {
      let updateData = req.body;
      if (!updateData.valor || updateData.valor == "")
        return res.status(400).send("Valor is required");

      updateData.participanteInclusao = req.user.id;
      updateData.dataInclusao = new Date();

      const movimentacao = new MovimentacaoFinanceira(updateData);
      await movimentacao.save();
      res.status(201).send(movimentacao);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async readAll(req, res) {
    const movimentacoes = await MovimentacaoFinanceira.find(req.query)
      .populate("participante", "nome")
      .populate("grupoTrabalho", "nome corEtiqueta")
      .populate("projeto", "nome corEtiqueta")
      .sort("-dataInclusao");
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
    try {
      const updateData = req.body;

      if (updateData.valor == "") return res.status(400).send("Valor is required");

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
    } catch (err) {
      res.status(400).send(err.message);
    }
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

  static async getSaldoTotal(req, res) {
    const saldo = await MovimentacaoFinanceira.aggregate([
      {
        $match: {
          status: "ativo",
        },
      },
      {
        $group: {
          _id: null,
          saldo: { $sum: { $multiply: ["$valor", "$tipoMovimentacao"] } },
        },
      },
    ]);

    if (!saldo[0]) {
      return res.status(404).send("Nenhuma movimentação financeira encontrada");
    }
    console.log({ saldo: saldo[0].saldo });

    res.send({ saldo: saldo[0].saldo });
  }
}

module.exports = movimentacoesFinanceirasController;
