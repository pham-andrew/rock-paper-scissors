const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}
const PORT = process.env.PORT || 3001
const app = express()

// if you are running locally, uncomment the line below
// const knex = require('knex')(require('./knexfile.js')['development']);
// if you are running in deployed enviroment, uncomment the line below
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV]);

app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  const authToken = req.cookies['AuthToken'];
  req.username = authTokens[authToken];
  next();
});

const requireAuth = (req, res, next) => {
  if (req.username) {
      next();
  } else {
    res.status(404).send("There was an error, user must be logged in")
  }
};

const getHashedPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password.concat(salt)).digest('base64');
  return {hash, salt}
}

const getHashedPasswordLogin = (password, salt) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password.concat(salt)).digest('base64');
  return hash
}

const generateAuthToken = () => {
  return crypto.randomBytes(30).toString('hex');
}

const authTokens = {};

function gameWinner(move1, move2) {
  if (move1 === move2) return 'Draw'
  if (move1 === 'rock' && move2 === 'scissors') return 'Player 1 Wins' 
  if (move1 === 'paper' && move2 === 'rock') return 'Player 1 Wins'
  if (move1 === 'scissors' && move2 === 'paper') return 'Player 1 Wins' 
  else return 'Player 2 Wins'
}

// usage http://localhost:3001/game?player1=rock&player2=paper
app.get('/game', function (req, res) {
  if (req.query.player1 && req.query.player2) res.status(200).json({results: gameWinner(req.query.player1.toLowerCase(), req.query.player2.toLowerCase())})
  else res.status(404).send("There was an error: correct usage => /game?player1=rock&player2=paper")
})

app.get('/game-results', function (req, res) {
  knex.select().table('game_results')
  .then(response => res.status(200).json(response))
  .catch(err => res.status(404).send("There was an error"))
})


app.post('/game-results', requireAuth, function (req, res) {
  console.log(req.username, req.body)
  const {won} = req.body
  knex('game_results').insert({username: req.username, won: won})
  .then(response => res.status(200).send("added results"))
  .catch(err => res.status(404).send("There was an error: ", err))
})

app.get('/game-results/user', requireAuth, (req, res) => {
  knex('game_results').where('username', req.username)
  .then(response => res.status(200).send(response))
  .catch(err => res.status(404).send("no data found"))
})

app.get('/leaderboard', requireAuth, (req,res) => {
  if (req.username === 'admin') {
    knex.select('username').table('game_results').where('won', '=', true).count('won').groupBy('username').orderBy('count', 'desc')
    .then(response => res.status(200).send(response))
    .catch(err => res.status(404).send(err))
  } else {
    res.status(404).send("no data found")
  }
})

app.get('/is-logged-in', requireAuth, function (req, res) {
  if (req.username === 'admin') {
    res.status(200).json({loggedIn: 'admin'})
  } else {
    res.status(200).json({loggedIn: true})
  }
})



app.post('/login', (req, res) => {
  const {username, password} = req.body
  console.log(username, password)
  knex.select('salt', 'password').table('users').where('username', username)
  .then(response => {
    const passwordHash = getHashedPasswordLogin(password, response[0].salt)
    if (passwordHash === response[0].password) {
      const authToken = generateAuthToken();
      authTokens[authToken] = username;
      res.cookie('AuthToken', authToken);
      res.status(200).send("user logged in")
    }
    else {
      res.status(401).send("incorrect password")
    }
  })
  .catch(err => res.status(404).send("user does not exist"))
})

// this is only for testing
app.get('/sign-up', (req, res) => {
  knex.select().table('users')
  .then(response => res.status(200).send(response))
  .catch(err => res.status(404).send(err))

})

app.post('/sign-up', (req, res) => {
  const {username, password} = req.body
  // see if username exists in database
  knex('users').where('username', username)
  .then(response => {
    if (response.length > 0) {
      res.status(200).send('user exists')
    }
    else {
      const {hash, salt} = getHashedPassword(password)
      knex('users').insert({username: username, password: hash, salt: salt })
      .then(response => res.status(200).send("user added"))
      .catch(err => res.status(404).send(err))
    }
  })
})

app.use(function (req, res, next) {
  next(createError(404))
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`))