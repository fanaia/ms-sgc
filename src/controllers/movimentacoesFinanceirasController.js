const MovimentacaoFinanceira = require("../models/MovimentacaoFinanceira");
const GrupoTrabalho = require("../models/GrupoTrabalho");

class movimentacoesFinanceirasController {
  static async save(req, res) {
    try {
      const updateData = req.body;

      updateData.participanteInclusao = req.user.id;
      updateData.dataInclusao = new Date();
      updateData.status = "pendente";

      let movimentacaoFinanceira;
      if (req.params.id) {
        updateData.participanteUltimaAlteracao = req.user.id;
        updateData.dataUltimaAlteracao = new Date();

        movimentacaoFinanceira = await MovimentacaoFinanceira.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        );
        if (!movimentacaoFinanceira) {
          return res.status(404).send("Movimentação Financeira não encontrada");
        }
      } else {
        movimentacaoFinanceira = new MovimentacaoFinanceira(updateData);
      }

      await movimentacaoFinanceira.save();
      res.status(201).send(movimentacaoFinanceira);
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

  static async delete(req, res) {
    const movimentacao = await MovimentacaoFinanceira.findById(req.params.id);
    if (!movimentacao) {
      return res.status(404).send("Movimentacao not found");
    }

    movimentacao.status = "cancelado";
    movimentacao.participanteUltimaAlteracao = req.user.id;
    movimentacao.dataUltimaAlteracao = new Date();

    await movimentacao.save();
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
      res.send({ saldo: 0 });
    }
    res.send({ saldo: saldo[0].saldo });
  }

  static async approve(req, res) {
    try {
      const responsavel = await GrupoTrabalho.findOne({ participanteResponsavel: req.user.id });
      if (!responsavel) {
        return res.status(403).send("Somente responsáveis por GT podem fazer aprovação");
      }

      const movimentacaoFinanceira = await MovimentacaoFinanceira.findById(req.params.id);
      if (!movimentacaoFinanceira) {
        return res.status(404).send("Movimentação Financeira não encontrada");
      }

      if (
        req.user.id == movimentacaoFinanceira.participanteUltimaAlteracao._id &&
        req.params.approve === "true"
      ) {
        return res.status(403).send("Não é possível aprovar a própria alteração");
      }

      movimentacaoFinanceira.status = req.params.approve === "true" ? "ativo" : "recusado";

      movimentacaoFinanceira.participanteUltimaAlteracao = req.user.id;
      movimentacaoFinanceira.dataUltimaAlteracao = new Date();

      await movimentacaoFinanceira.save();
      res.status(200).send(movimentacaoFinanceira);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
}

module.exports = movimentacoesFinanceirasController;
