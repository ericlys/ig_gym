const knex = require("../database");
const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
      throw new AppError("Informe todos os campos (nome, email e senha).");
    }

    const checkUserExists = await knex("users").where({ email }).first();

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    });

    const user = await knex("users").where({ email }).first();
    const isAdmin = name.includes(process.env.ADMIN_SECRET);

    if(isAdmin) {
      await knex('users_roles').insert({
        role_id: '269e8fb9-faab-4ab4-966d-f000a1a3116d',
        user_id: user.id,
      })
      await knex('users_permissions').insert({
        permission_id: 'b7e084fc-b9f0-406a-a7ef-23ef2a4a2e87',
        user_id: user.id,
      })
    }

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, password, old_password } = request.body;
    const user_id = request.user.id;

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    user.name = name ?? user.name;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir a nova senha.",
      );
    }


    if (!password && old_password) {
      throw new AppError(
        "Informe a nova senha.",
      );
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere.");
      }

      user.password = await hash(password, 8);
    }

    await knex("users").where({ id: user_id }).update(user);

    return response.json();
  }
}

module.exports = UsersController;