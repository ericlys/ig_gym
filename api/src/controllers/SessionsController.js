const knex = require("../database");
const { compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const GenerateRefreshToken = require("../providers/GenerateRefreshToken");
const GenerateToken = require("../providers/GenerateToken");

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knex
    .select(
      'users.*', 
      knex.raw('json_agg(DISTINCT permissions) as permissions'),
      knex.raw('json_agg(DISTINCT roles)as roles'),
    )
    .from('users')
    .where({ email: email.toLowerCase() })
    .leftJoin('users_permissions', 'users.id', '=', 'users_permissions.user_id')
    .leftJoin('permissions', 'users_permissions.permission_id', '=', 'permissions.id')
    .leftJoin('users_roles', 'users.id', '=', 'users_roles.user_id')
    .leftJoin('roles', 'users_roles.role_id', '=', 'roles.id')
    .groupBy('users.id')
    .first();

    if (!user) {
      throw new AppError("E-mail e/ou senha incorreta.", 404);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("E-mail e/ou senha incorreta.", 404);
    }

    const generateTokenProvider = new GenerateToken();
    const token = await generateTokenProvider.execute(user.id);

    const generateRefreshToken = new GenerateRefreshToken();
    const refresh_token = await generateRefreshToken.execute(user.id);

    delete user.password;

    if(user.avatar) {
      const img_url = process.env.DISK === 'local'
      ? `${process.env.APP_API_URL}/avatar/${user.avatar}` 
      : `${process.env.AWS_BUCKET_URL}/avatar/${user.avatar}`;
      
      user.avatar = img_url;
    }

    response.status(201).json({ user, token, refresh_token });
  }
}

module.exports = SessionsController;