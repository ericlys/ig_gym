exports.up = knex => knex.schema.createTable("roles", table => {
  table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
  table.text("name").notNullable();
  table.text("description").notNullable();
  table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("roles");