import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../index.js';
var expect = chai.expect;

chai.use(chaiHttp);

describe('/GET healthz', () => {
  it('it should check healthz endpoint', async () => {
    const res = await chai.request(server).get('/healthz'); 
    expect(res.status).to.equal(200);
  });
});

