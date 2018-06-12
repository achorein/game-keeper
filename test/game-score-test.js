// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const assertArrays = require('chai-arrays');

chai.use(chaiHttp);
chai.use(assertArrays);
chai.should();

const server = require('../src/server');

// Our parent block
describe('Game score', () => {
  describe('/GET max score', () => {
    it('it should GET max score', (done) => {
      chai.request(server)
        .get('/api/score/max')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('playername', 'player4');
          res.body.should.have.property('score', 2300);
          done();
        });
    });
  });

  describe('/GET top ten score', () => {
    it('it should GET top ten score ordered', (done) => {
      chai.request(server)
        .get('/api/score/top')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(9);
          res.body.should.be.sorted((prev, next) => prev.score < next.score);
          done();
        });
    });
  });

  describe('/GET max score for level', () => {
    it('it should GET max score level 1', (done) => {
      chai.request(server)
        .get('/api/score/level/1/max')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('level', 1);
          res.body.should.have.property('playername');
          res.body.should.have.property('score', 1400);
          done();
        });
    });
    it('it should GET max score level 2', (done) => {
      chai.request(server)
        .get('/api/score/level/2/max')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('level', 2);
          res.body.should.have.property('playername');
          res.body.should.have.property('score', 2300);
          done();
        });
    });
  });

  describe('/GET max score for player', () => {
    it('it should GET max score for player1', (done) => {
      chai.request(server)
        .get('/api/score/player/player1/max')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('playername', 'player1');
          res.body.should.have.property('score', 2000);
          done();
        });
    });
    it('it should GET max score for player2', (done) => {
      chai.request(server)
        .get('/api/score/player/player2/max')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('playername', 'player2');
          res.body.should.have.property('score', 2100);
          done();
        });
    });
  });

  describe('/PUT score', () => {
    it('it should PUT new score', (done) => {
      chai.request(server)
        .put('/api/score')
        .send({ playername: 'player5', player: 'skin5', level: 2, score: 2400 })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/POST score', () => {
    it('it should POST reset score error', (done) => {
      chai.request(server)
        .post('/api/score/reset')
        .send({ securitycheck: 'bad password' })
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('it should POST reset score', (done) => {
      chai.request(server)
        .post('/api/score/reset')
        .send({ securitycheck: 'game_keeper' })
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });
  });
});
