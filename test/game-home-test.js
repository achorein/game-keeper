// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

const server = require('../src/server');

describe('Global', () => {
  describe('/GET welcome message', () => {
    it('it should GET welcome message', (done) => {
      chai.request(server)
        .get('/api')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('version');
          done();
        });
    });
  });
});
