exports.up = knex => knex.schema.createTable("refresh_tokens", table => {
  table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
  table.integer("expires_in");
  table.text("refresh_token");
  table.uuid("user_id").references("id").inTable("users");
  table.timestamp("created_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("refresh_tokens");