exports.up = knex => knex.schema
.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
.createTable("users", table => {
  table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
  table.text("name").notNullable();
  table.text("email").notNullable();
  table.text("password").notNullable();
  table.text("avatar");
  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("users");