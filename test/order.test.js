const request = require('supertest');

const app = require('../server');

function createLoginToken(server, loginDetails, done) {
  request(server)
      .post('/users/user-login')
      .send(loginDetails)
      .end(function(error, response) {
          if (error) {
              throw error;
          }
          let loginToken = response.body.token;
          done(loginToken);
      });
}

  describe('Orders', () => {
    it('GET / => list of order', () => {
      return request(app)
        .get('/orders/order')

        .expect('Content-Type', /json/)

        .expect(200)
    });

  it('POST /orders/add-order/ => create a new order', () => {
    return (
      createLoginToken(app, { username: 'admin', password: 'admin' }, function(header) {
        request(app)
        .post('/orders/add-order/')

        // Item send code

        .set('Authorization', header)
        .send({
          item_id: 1,
          qty: 5,
        })

        .expect('Content-Type', /json/)

        .expect(201)
      })
    );
  });
  
  it('UPDATE /update-status-order => update status of order', () => {
      return createLoginToken(app, { username: 'admin', password: 'admin' }, function(header) {
        request(app).put('/update-status-order').send({
          item_id: 1,
        }).expect(200)
      });
    });

  it('DELETE /orders/del-item-order => update status of order', () => {
    return createLoginToken(app, { username: 'admin', password: 'admin' }, function(header) {
      request(app).delete('/orders/del-item-order').send({
        userid: 1,
        id: 1,
      }).expect(200)
    });
  });
}) 
