const knex = require("../database");

function can(permissionsRoutes) {
  return async(request, response, next) => {
    const user_id = request.user.id;

    const user = await knex
    .select(
      'users.*', 
      knex.raw('json_agg(DISTINCT permissions) as permissions')
    )
    .from('users')
    .where({ 'users.id': user_id }) 
    .leftJoin('users_permissions', 'users.id', '=', 'users_permissions.user_id')
    .leftJoin('permissions', 'users_permissions.permission_id', '=', 'permissions.id')
    .groupBy('users.id')
    .first();

    if(!user) {
      return response.status(400).json("Usuário não existe");
    }
    
    const permissionExists = user.permissions
    ?.filter(permission => permission != null)
    ?.map(permission => permission.name)
    ?.some(permission => permissionsRoutes.includes(permission));
    console.log(user.permissions)

    if(!permissionExists) {
      return response.status(403).end();
    }

    return next();
  }
}

function is(rolesRoutes) {
  return async(request, response, next) => {
    const user_id = request.user.id;

    const user = await knex
    .select(
      'users.*', 
      knex.raw('json_agg(DISTINCT roles) as roles'),
    )
    .from('users')
    .where({ 'users.id': user_id }) 
    .leftJoin('users_roles', 'users.id', '=', 'users_roles.user_id')
    .leftJoin('roles', 'users_roles.role_id', '=', 'roles.id')
    .groupBy('users.id')
    .first();

    console.log(user)

    if(!user) {
      return response.status(400).json("Usuário não existe");
    }

    const rolesExists = user.roles
    .map(roles => roles.name)
    .some(roles => rolesRoutes.includes(roles))

    if(!rolesExists) {
      return response.status(403).end();
    }

    return next();
  }
}

module.exports = { can, is };