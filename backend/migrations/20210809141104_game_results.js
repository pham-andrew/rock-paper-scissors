
exports.up = function(knex) {
  return knex.schema.createTable('users', table => {
    table.increments('user_id'); // adds an auto incrementing PK column
    table.string('username').unique();
    table.string('password');
    table.string('salt');
  })
  .then(() => {
    return knex.schema.createTable('game_results', table => {
      table.increments('game_result_id'); // adds an auto incrementing PK column
      table.integer('user_id').references('user_id').inTable('users');
      table.boolean('won');
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTable('game_results')
  .dropTable('users');
};
