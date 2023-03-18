const knex = require("../database");
const dayjs = require("dayjs");
const crypto = require("crypto");

class GenerateRefreshToken {
  async execute(user_id) {
    await knex("refresh_tokens").where({ user_id }).delete();

    const expires_in = dayjs().add(15, "m").unix();

    const refresh_token = crypto.randomUUID();

    await knex("refresh_tokens").insert({
      user_id: user_id,
      expires_in,
      refresh_token
    });

    return refresh_token;
  }
}

module.exports = GenerateRefreshToken;