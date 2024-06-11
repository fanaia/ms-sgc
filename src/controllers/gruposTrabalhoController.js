const getGrupoTrabalho = require("../models/GrupoTrabalho");
const getParticipante = require("../models/Participante");

class grupoTrabalhosController {
  static async save(req, res) {
    const GrupoTrabalho = getGrupoTrabalho(req.identificador);
    const Participante = getParticipante(req.identificador);

    try {
      const updateData = req.body;
      if (!updateData.nome || updateData.nome == "")
        return res.status(400).send("Nome é obrigatório");

      const count = await Participante.countDocuments({ status: "ativo" });
      updateData.status = count === 1 ? "ativo" : "pendente";

      updateData.participanteUltimaAlteracao = req.user.id;
      updateData.dataUltimaAlteracao = new Date();

      let grupoTrabalho;
      if (req.params.id) {
        grupoTrabalho = await GrupoTrabalho.findByIdAndUpdate(req.params.id, updateData, {
          new: true,
        });
        if (!grupoTrabalho) {
          return res.status(404).send("No grupoTrabalho found with given id");
        }
      } else {
        updateData.participanteInclusao = req.user.id;
        updateData.dataInclusao = new Date();

        grupoTrabalho = new GrupoTrabalho(updateData);
      }

      await grupoTrabalho.save();
      res.status(201).send(grupoTrabalho);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }

  static async readAll(req, res) {
    const GrupoTrabalho = getGrupoTrabalho(req.identificador);
    const gruposTrabalho = await GrupoTrabalho.find(req.query)
      .populate("participanteResponsavel", "nome")
      .sort("nome");
    res.send(gruposTrabalho);
  }

  static async readOne(req, res) {
    const GrupoTrabalho = getGrupoTrabalho(req.identificador);
    const grupoTrabalho = await GrupoTrabalho.findById(req.params.id);
    if (!grupoTrabalho) {
      return res.status(404).send("Grupo de Trabalho not found");
    }
    res.send(grupoTrabalho);
  }

  static async delete(req, res) {
    const GrupoTrabalho = getGrupoTrabalho(req.identificador);
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

  static async approve(req, res) {
    const GrupoTrabalho = getGrupoTrabalho(req.identificador);
    try {
      const grupoTrabalhoCount = await GrupoTrabalho.aggregate([
        { $match: { status: "ativo" } },
        { $group: { _id: "$participanteResponsavel", count: { $sum: 1 } } },
      ]);

      if (grupoTrabalhoCount.length > 0) {
        const responsavel = await GrupoTrabalho.findOne({ participanteResponsavel: req.user.id });
        if (!responsavel)
          return res.status(403).send("Somente responsáveis por GT podem fazer aprovação");
      }

      const grupoTrabalho = await GrupoTrabalho.findById(req.params.id);
      if (!grupoTrabalho) return res.status(404).send("GT não encontrado");

      if (
        req.user.id == grupoTrabalho.participanteUltimaAlteracao._id &&
        req.params.approve === "true" &&
        grupoTrabalhoCount.length > 1
      ) {
        return res.status(403).send("Não é possível aprovar a própria alteração");
      }

      grupoTrabalho.status = req.params.approve === "true" ? "ativo" : "recusado";

      grupoTrabalho.participanteUltimaAlteracao = req.user.id;
      grupoTrabalho.dataUltimaAlteracao = new Date();

      await grupoTrabalho.save();
      res.status(200).send(grupoTrabalho);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
}

module.exports = grupoTrabalhosController;
