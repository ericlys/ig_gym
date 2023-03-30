
exports.up = knex => knex.schema.createTable('users_permissions', table => {
  table.uuid('permission_id').unsigned().references('id').inTable('permissions');
  table.uuid('user_id').unsigned().references('id').inTable('users');
  table.primary(['permission_id', 'user_id']);
  table.index('user_id');
  table.index('permission_id');
})


exports.down = knex => knex.schema.dropTable('users_permissions');
