exports.up = knex => knex.schema.createTable("history", table => {
  table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

  table.uuid("user_id").references("id").inTable("users");
  table.uuid("exercise_id").references("id").inTable("exercises");

  table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("history");