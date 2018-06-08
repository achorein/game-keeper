# game-keeper
Light node js server providing rest api for some games

[![Build Status](https://travis-ci.org/achorein/game-keeper.svg?branch=master)](https://travis-ci.org/achorein/game-keeper)
[![Inline docs](http://inch-ci.org/github/achorein/game-keeper.svg?branch=master)](http://inch-ci.org/github/achorein/game-keeper)

# API

| Endpoint  | Description 
| ------------- | -------------
| GET /api/score/max | 
| GET /api/score/top | 
| GET /api/score/level/(level)/max |
| GET /api/score/player/(playername)/max  | 
| PUT /api/score' | { playername: 'player1', player: 'skin1', level: 1, score: 7732 }
| POST /api/score/reset | { securitycheck: 'password'}

# Envrionnement variable

| Name  | Description | Example
| ------------- | ------------- | -------------
| CORS | Manage Cross-origin resource sharing | http://game.ultimateplateform.v1kings.io
| PORT | Server port | 7312
| DATA_DIR | Directory to store dabase file | data/
| PASSWORD | Password used ti reset all score | game_keeper
