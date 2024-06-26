const Atividade = require("../models/Atividade");
const GrupoTrabalho = require("../models/GrupoTrabalho");
const MovimentacaoToken = require("../models/MovimentacaoToken");

class atividadesController {
  static async save(req, res) {
    try {
      const updateData = req.body;
      if (updateData.descricao == "")
        return res.status(400).send("Descrição da atividade é obrigatória");

      updateData.totalTokens = updateData.totalHoras * req.user.tokenHora;
      updateData.participanteUltimaAlteracao = req.user.id;
      updateData.dataUltimaAlteracao = new Date();
      updateData.status = "pendente";

      let atividade;
      if (req.params.id) {
        atividade = await Atividade.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!atividade) {
          return res.status(404).send("Atividade not found");
        }
      } else {
        updateData.participanteInclusao = req.user.id;
        updateData.dataInclusao = new Date();

        atividade = new Atividade(updateData);
        await atividade.save();
      }

      const movimentacaoToken = await MovimentacaoToken.findOneAndUpdate(
        {
          origem: "atividade",
          item: atividade._id,
          acao: "conquistar",
        },
        {
          participante: atividade.participante._id,
          valor: atividade.totalTokens,
          tipoMovimentacao: 1,
          status: atividade.status,
          participanteInclusao: req.user.id,
          dataInclusao: new Date(),
        },
        {
          new: true,
          upsert: true,
        }
      );
      await movimentacaoToken.save();

      res.send(atividade);
    } catch (err) {
      console.log(err);
      res.status(400).send(err.message);
    }
  }

  static async readAll(req, res) {
    const atividades = await Atividade.find(req.query)
      .populate("participante", "nome")
      .populate("grupoTrabalho", "nome corEtiqueta")
      .populate("projeto", "nome corEtiqueta")
      .sort("-dataInclusao");
    res.send(atividades);
  }

  static async readOne(req, res) {
    const atividade = await Atividade.findById(req.params.id);
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

    atividade.status = "cancelado";
    atividade.participanteUltimaAlteracao = req.user.id;
    atividade.dataUltimaAlteracao = new Date();

    await atividade.save();

    await MovimentacaoToken.updateMany(
      { origem: "atividade", item: atividade._id },
      {
        status: "cancelado",
        participanteUltimaAlteracao: req.user.id,
        dataUltimaAlteracao: new Date(),
      }
    );

    res.status(204).send();
  }

  static async approve(req, res) {
    try {
      const responsavel = await GrupoTrabalho.findOne({ participanteResponsavel: req.user.id });
      if (!responsavel) {
        return res.status(403).send("Somente responsáveis por GT podem fazer aprovação");
      }

      const atividade = await Atividade.findById(req.params.id);
      if (!atividade) {
        return res.status(404).send("Atividade não encontrada");
      }

      if (
        req.user.id == atividade.participanteUltimaAlteracao._id &&
        req.params.approve === "true"
      ) {
        return res.status(403).send("Não é possível aprovar a própria alteração");
      }

      atividade.status = req.params.approve === "true" ? "ativo" : "recusado";

      atividade.participanteUltimaAlteracao = req.user.id;
      atividade.dataUltimaAlteracao = new Date();

      await atividade.save();
      res.status(200).send(atividade);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
}

module.exports = atividadesController;
