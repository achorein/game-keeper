var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
// parse application/json
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 7312;
var dataDir = process.env.DATA_DIR || 'data/';
var password = process.env.PASSWORD || 'game_keeper';

var Datastore = require('nedb');
var db = new Datastore({ filename: dataDir + 'game.db', autoload: true });
db.ensureIndex({ fieldName: 'score' }, function (err) {
    if (err) return console.log('Ooops! ' + err);
});

app.get('/api', function(req, res) {
    res.send({name:'Game Keeper', version: '1.0'});
});

/**
 * SCORE GLOBAL.
 */
// Récupération du highscore global
app.get('/api/score/max', function(req, res) {
    db.findOne({ score: { $exists: true }}).sort({ score: -1, date: -1 }).limit(1).exec(function(err, value) {
        if (err) return console.log('Ooops! ' + req.url, err);
        console.log(req.url + ': ' + JSON.stringify(value));
        if (value == null) {
            value = {playername: 'Computer', score: 0}
        }
        res.send(value);
    });
});

// Récupération des 10 meilleurs scores globaux
app.get('/api/score/top', function(req, res) {
    db.find({ score: { $exists: true }}).sort({ score: -1, date: -1 }).limit(10).exec(function(err, values) {
        if (err) return console.log('Ooops! ' + req.url, err);
        console.log(req.url + ': ' + JSON.stringify(values));
        res.send(values);
    });
});

/**
 * SCORE PAR LEVEL.
 */
// Récupération du highscore pour un niveau (et pour un joueur si nécessaire)
app.get('/api/score/level/:level/max', function(req, res) {
    console.log(req.params);
    var search = {
        score: { $exists: true },
        level: parseInt(req.params.level)
    };
    if (req.query.playername) { // parametre get ?playername=
        search.playername = req.query.playername;
    }
    db.findOne(search).sort({ score: -1, date: -1 }).limit(1).exec(function(err, value) {
        if (err) return console.log('Ooops! ' + req.url, err);
        console.log(req.url + ': ' + JSON.stringify(value));
        if (value == null) {
            value = {playername: '', level: search.level, score: 0}
        }
        res.send(value);
    });
});


/**
 * SCORE PAR JOUEUR.
 */
// Récupération du highscore pour d'un joueur
app.get('/api/score/player/:playername/max', function(req, res) {
    db.findOne({
        playername: req.params.playername,
        score: { $exists: true }
    }).sort({ score: -1, date: -1 }).limit(1).exec(function(err, value) {
        if (err) return console.log('Ooops! ' + req.url, err);
        console.log(req.url + ': ' + JSON.stringify(value));
        if (value == null) {
            value = {playername: req.params.playername, score: 0}
        }
        res.send(value);
    });
});

/**
 * MANIPULATION DES SCORES
 */
// Ajout d'un nouveau score
app.put('/api/score', function (req, res) {
    var data = req.body;
    db.insert({
        playername: data.playername,
        player: data.player,
        level: data.level,
        score: data.score,
        date: Date.now()
    }, function (err, value) {
        if (err) return console.log('Ooops! ' + req.url, err);
        res.send(value);
    });
});

// Reset de tous les scores
app.post('/api/score/reset', function (req, res) {
    var data = req.body;
    if (data.securitycheck == password) {
        db.remove({}, {multi: true}, function (err, value) {
            if (err) return console.log('Ooops! ' + req.url, err);
            console.log(req.url + ': removed ' + JSON.stringify(value));
            res.send({removed:  value});
        });
    } else {
        res.sendStatus(401);
    }
});

/**
 * LANCEMENT DU SERVEUR
 */
app.listen(port, function () {
    console.log('Game server listening on port ' + port);
});
