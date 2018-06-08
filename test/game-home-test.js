//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app/server');
let should = chai.should();

chai.use(chaiHttp);

describe('Global', () => {
  describe('/GET welcome message', () => {
      it('it should GET welcome message', (done) => {
        chai.request(server)
            .get('/api')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
              done();
            });
      });
  });
});
