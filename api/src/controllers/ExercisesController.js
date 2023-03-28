const knex = require("../database");

class ExercisesController {

  async create(request, response) {
    const { name, series, repetitions, group, demo, thumb} = request.body;

    if (!name || !series || !repetitions, !group || !demo || !thumb) {
      throw new AppError("Informe todos os campos (nome, series, repetições, grupo, thumbnail e imagem).");
    }

    await knex("exercises").insert({
      name,
      series,
      repetitions,
      group,
      demo,
      thumb
    })

    return response.status(201).json();
  }

  async index(request, response) {
    const { group } = request.params;

    const exercises = await knex("exercises").where({ group }).orderBy("name");

    return response.json(exercises);
  }

  async show(request, response) {
    const { id } = request.params;

    const exercise = await knex("exercises").where({ id }).first();

    return response.json(exercise);
  }
}

module.exports = ExercisesController;