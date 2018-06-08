//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

//Our parent block
describe('Game score', () => {
    beforeEach((done) => { //Before each test we empty the database
        done(); 
    });

    describe('/GET max score', () => {
      it('it should GET max score', (done) => {
        chai.request(server)
            .get('/api/score/max')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('playername');
                res.body.should.have.property('score');
              done();
            });
      });
    });

    describe('/GET top ten score', () => {
      it('it should GET top ten score', (done) => {
        chai.request(server)
            .get('/api/score/top')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
              done();
            });
      });
    });

    describe('/GET max score for level 1', () => {
      it('it should GET max score', (done) => {
        chai.request(server)
            .get('/api/score/level/1/max')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('playername');
                res.body.should.have.property('score');
              done();
            });
      });
    });

    describe('/GET max score for playername', () => {
      it('it should GET max score for playername', (done) => {
        chai.request(server)
            .get('/api/score/player/playername/max')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('playername');
                res.body.should.have.property('score');
              done();
            });
      });
    });
    
});
