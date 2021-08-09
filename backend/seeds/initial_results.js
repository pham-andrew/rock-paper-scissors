
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'testuser1', password: 'hellogoodbye1', salt: 'thisisnotapropersalt1'},
        {username: 'testuser2', password: 'hellogoodbye2', salt: 'thisisnotapropersalt2'},
        {username: 'testuser3', password: 'hellogoodbye3', salt: 'thisisnotapropersalt3'}
      ]);
    })
    .then(function () {
      // Inserts seed entries
      return knex('game_results').insert([
        { user_id: 1, won: true },
        { user_id: 1, won: true },
        { user_id: 1, won: true },
        { user_id: 2, won: true },
        { user_id: 2, won: true },
        { user_id: 2, won: false },
      ]);
    });
};
