const request = require('supertest');
const app = require('../app');

describe('XSS protection', function() {
  it('should prevent XSS attack', function(done) {
    request(app)
      .post('/api/xss-test')
      .send({ input: '<script>alert("XSS attack!")</script>' })
      .expect(200)
      .expect(res => {
        if (res.text.includes('<script>alert("XSS attack!")</script>')) {
          throw new Error('XSS attack not properly prevented');
        }
        console.log(res.text);
      })
      .end(done);
  });
});