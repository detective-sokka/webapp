import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index.js';
var expect = chai.expect;

chai.use(chaiHttp);

describe('/GET healthz', () => {
    it('it should check healthz endpoint', (done) => {
      chai.request(server)
          .get('/healthz')
          .then((res) => {            
            expect(res).should.have.status(200);                
            done();
          }).catch((err) => {
            expect(err).to.be.null;
            done();
          });
          done();
    });
    
});
