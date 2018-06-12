// DEPENDANCIES
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Datastore = require('nedb');

// CONSTANTES
const VERSION = JSON.parse(fs.readFileSync('./package.json')).version;
const PORT = process.env.PORT || 7312;
const DATA_DIR = process.env.DATA_DIR || 'data/';
const DB_FILEPATH = (process.env.NODE_ENV === 'test') ? 'test/game-test.db' : `${DATA_DIR}/game.db`;
const PASSWORD = process.env.PASSWORD || 'game_keeper';
const CONTEXT_ROOT = (process.env.CONTEXTROOT === '/') ? '' : process.env.CONTEXTROOT || '/api';
const CORS_OPTIONS = (process.env.CORS) ? { origin: process.env.CORS } : null;

// Manage application server
const app = express();
app.use(bodyParser.json()); // unable auto parsing for application/json content
app.use(cors(CORS_OPTIONS));

// Manage database
const db = new Datastore({ filename: DB_FILEPATH, autoload: true });
db.ensureIndex({ fieldName: 'score' }, (err) => {
  if (err) console.log('Ooops! ', err);
});

/* ************************************************************************
 *  API ROUTES
 ************************************************************************* */

/**
 * Home page (ex: /api)
 */
app.get(CONTEXT_ROOT, (req, res) => {
  res.send({ name: 'Game Keeper', version: VERSION });
});


/* **************
 * GLOBAL SCORE
 ************** */

/**
 * Retrieve the highscore score (all player and all level)
 */
app.get(`${CONTEXT_ROOT}/score/max`, (req, res) => {
  db.findOne({ score: { $exists: true } })
    .sort({ score: -1, date: -1 }).limit(1)
    .exec((err, value) => {
      if (err) return console.log(`Ooops! ${req.url}`, err);
      console.log(`${req.url}: ${JSON.stringify(value)}`);
      return res.send(value || { playername: 'Computer', score: 0 });
    });
});

/**
 * Retrieve top 10 scores (all player and all level)
 */
app.get(`${CONTEXT_ROOT}/score/top`, (req, res) => {
  db.find({ score: { $exists: true } })
    .sort({ score: -1, date: -1 }).limit(10)
    .exec((err, values) => {
      if (err) return console.log(`Ooops! ${req.url}`, err);
      console.log(`${req.url}: ${JSON.stringify(values)}`);
      return res.send(values);
    });
});

/* **************
 * LEVELS SCORE
 ************** */

/**
 * Retrieve highest score for a level (and player if needed)
 * @param level Level number (URL Parameter)
 * @param playername Player name (Query parameter: ?playername=)
 */
app.get(`${CONTEXT_ROOT}/score/level/:level/max`, (req, res) => {
  console.log(req.params);
  const search = {
    score: { $exists: true },
    level: parseInt(req.params.level, 10),
  };
  if (req.query.playername) {
    search.playername = req.query.playername;
  }
  db.findOne(search).sort({ score: -1, date: -1 }).limit(1).exec((err, value) => {
    if (err) return console.log(`Ooops! ${req.url}`, err);
    console.log(`${req.url}: ${JSON.stringify(value)}`);
    return res.send(value || { playername: '', level: search.level, score: 0 });
  });
});


/* **************
 * PLAYER SCORE
 ************** */

/**
 * Retreive highest score for a player
 * @param Player name (URL parameter)
 */
app.get(`${CONTEXT_ROOT}/score/player/:playername/max`, (req, res) => {
  db.findOne({
    playername: req.params.playername,
    score: { $exists: true },
  }).sort({ score: -1, date: -1 }).limit(1).exec((err, value) => {
    if (err) return console.log(`Ooops! ${req.url}`, err);
    console.log(`${req.url}: ${JSON.stringify(value)}`);
    return res.send(value || { playername: req.params.playername, score: 0 });
  });
});

/* **************
 * SCORES UPDATES
 ************** */

/**
 * Add new score
 * @param body { "playername": "player1", "player": "skin1", "level": "1", "score": "7732" }
 */
app.put(`${CONTEXT_ROOT}/score`, (req, res) => {
  const data = req.body;
  db.insert({
    playername: data.playername,
    player: data.player,
    level: data.level,
    score: data.score,
    date: Date.now(),
  }, (err, value) => {
    if (err) return console.log(`Ooops! ${req.url}`, err);
    return res.send(value);
  });
});

/**
 * Reset all scores
 * @param securitycheck Password header to ensure some security
 */
app.post(`${CONTEXT_ROOT}/score/reset`, (req, res) => {
  const data = req.body;
  if (data.securitycheck === PASSWORD) {
    db.remove({}, { multi: true }, (err, value) => {
      if (err) return console.log(`Ooops! ${req.url}`, err);
      console.log(`${req.url}: removed ${JSON.stringify(value)}`);
      return res.sendStatus(204);
    });
  } else {
    res.sendStatus(401);
  }
});

/* **************
 * SERVER START
 ************** */
app.listen(PORT, () => {
  console.log(`Game server listening on port ${PORT}`);
});

module.exports = app; // needed for testing
