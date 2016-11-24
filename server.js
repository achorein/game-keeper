var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')

var app = express();
// parse application/json
app.use(bodyParser.json());
app.use(cors());

var Datastore = require('nedb');
var db = new Datastore({ filename: 'game.db', autoload: true });

app.get('/api', function(req, res) {
    res.send('Game Keeper');
});

// Récupération du highscore
app.get('/api/score/max', function(req, res) {
    db.findOne({ score: { $exists: true }}).sort({ score: -1, date: -1 }).limit(1).exec(function(err, value) {
        if (err) return console.log('Ooops!', err);
        //console.log('score max =' + JSON.stringify(value));
	if (value == null) {
	    value = {name: '', score: 0}
        }
        res.send(value);
    });
});

// Récupération des 10 meilleurs scores
app.get('/api/score/top', function(req, res) {
    db.find({ score: { $exists: true }}).sort({ score: -1, date: -1 }).limit(10).exec(function(err, values) {
        if (err) return console.log('Ooops!', err);
        //console.log(JSON.stringify(values));
        res.send(values);
    });
});

// Ajout d'un nouveau score
app.put('/api/score', function (req, res) {
    var data = req.body;
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
