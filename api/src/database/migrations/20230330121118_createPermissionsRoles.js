
exports.up = knex => knex.schema.createTable('permissions_roles', table => {
  table.uuid('role_id').unsigned().references('id').inTable('roles');
  table.uuid('permission_id').unsigned().references('id').inTable('permissions');
  table.primary(['role_id', 'permission_id']);
  table.index('role_id');
  table.index('permission_id');
})


exports.down = knex => knex.schema.dropTable('permissions_roles');
