const GrupoTrabalho = require("../models/GrupoTrabalho");
const Projeto = require("../models/Projeto");

class projetosController {
  static async save(req, res) {
    try {
      const updateData = req.body;
      if (!updateData.nome || updateData.nome == "")
        return res.status(400).send("Nome é obrigatório");

      updateData.participanteInclusao = req.user.id;
      updateData.dataInclusao = new Date();
      updateData.status = "pendente";

      let projeto;
      if (req.params.id) {
        updateData.participanteUltimaAlteracao = req.user.id;
        updateData.dataUltimaAlteracao = new Date();

        projeto = await Projeto.findByIdAndUpdate(req.params.id, updateData, {
          new: true,
        });
        if (!projeto) {
          return res.status(404).send("No projeto found with given id");
        }
      } else {
        projeto = new Projeto(updateData);
      }

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

  static async approve(req, res) {
    try {
      const responsavel = await GrupoTrabalho.findOne({ participanteResponsavel: req.user.id });
      if (!responsavel) {
        return res.status(403).send("Somente responsáveis por GT podem fazer aprovação");
      }

      const projeto = await Projeto.findById(req.params.id);
      if (!projeto) {
        return res.status(404).send("Projeto não encontrado");
      }

      if (req.user.id == projeto.participanteUltimaAlteracao._id && req.params.approve === "true") {
        return res.status(403).send("Não é possível aprovar a própria alteração");
      }

      projeto.status = req.params.approve === "true" ? "ativo" : "recusado";

      projeto.participanteUltimaAlteracao = req.user.id;
      projeto.dataUltimaAlteracao = new Date();

      await projeto.save();
      res.status(200).send(projeto);
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
}

module.exports = projetosController;
