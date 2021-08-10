
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
        { username: 'testuser1', won: true },
        { username: 'testuser1', won: true },
        { username: 'testuser1', won: true },
        { username: 'testuser2', won: true },
        { username: 'testuser2', won: true },
        { username: 'testuser2', won: false },
      ]);
    });
};
