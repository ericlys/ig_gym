
exports.up = knex => knex.schema.createTable('users_roles', table => {
  table.uuid('role_id').unsigned().references('id').inTable('roles');
  table.uuid('user_id').unsigned().references('id').inTable('users');
  table.primary(['role_id', 'user_id']);
  table.index('user_id');
  table.index('role_id');
})


exports.down = knex => knex.schema.dropTable('users_roles');
