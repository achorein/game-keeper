var express = require('express');
var bodyParser = require('body-parser');

var app = express();
// parse application/json
app.use(bodyParser.json());

var Datastore = require('nedb');
var db = new Datastore({ filename: 'game.db', autoload: true });

app.get('/', function(req, res) {
    res.send('Game Keeper');
});

// Récupération du highscore
app.get('/score/max', function(req, res) {
    db.findOne({ score: { $exists: true }}).sort({ score: -1, date: -1 }).limit(1).exec(function(err, value) {
        if (err) return console.log('Ooops!', err);
        console.log('score max =' + JSON.stringify(value));
        res.send(value);
    });
});

// Récupération des 10 meilleurs scores
app.get('/score/top', function(req, res) {
    db.find({ score: { $exists: true }}).sort({ score: -1, date: -1 }).limit(10).exec(function(err, values) {
        if (err) return console.log('Ooops!', err);
        console.log(JSON.stringify(values));
        res.send(values);
    });
});

// Ajout d'un nouveau score
app.put('/score', function (req, res) {
    var data = req.body.data;
    db.insert({
        name: data.name,
        player: data.player,
        score: data.score,
        date: Date.now()
    }, function (err, value) {
        if (err) return console.log('Ooops!', err);
        res.send(value);
    });
});

app.listen(7312, function () {
    console.log('Game server listening on port 7312 !');
});
