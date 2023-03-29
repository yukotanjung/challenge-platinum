const request = require('supertest');

const app = require('./server');

function createLoginToken(server, loginDetails, done) {
  request(server)
      .post('/login')
      .send(loginDetails)
      .end(function(error, response) {
          if (error) {
              throw error;
          }
          let loginToken = response.body.token;
          done(loginToken);
      });
}

describe('GET /', () => {
  it('GET / => array of items', () => {
    return request(app)
      .get('/items/item')

      .expect('Content-Type', /json/)

      .expect(200)

      .then((response) => {
        expect(response.body.data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              item_id: expect.any(Number),
              item_name: expect.any(String),
              stock: expect.any(Number),
              price: expect.any(Number),
              status: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ])
        );
      });
  });

  it('GET / => a item by item ID', () => {
    return request(app)
      .get('/items/detail-item/')

      .send({
        item_id: 2,
      })

      .expect('Content-Type', /json/)

      .expect(200)

      .then((response) => {
        expect(response.body.data).toEqual(
          expect.objectContaining({
              item_id: expect.any(Number),
              item_name: expect.any(String),
              stock: expect.any(Number),
              price: expect.any(Number),
              status: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
          })
        );
      });
  });

  it('POST / => create a new item', () => {
    return (
      createLoginToken(app, { username: 'thohariakb', password: 'thohari123' }, function(header) {
        request(app)
        .post('/items/add-item/')

        // Item send code

        .set('Authorization', header)
        .send({
          item_name: 'Macbook Pro 2017',
          stock: 5,
          price: 10000000
        })

        .expect('Content-Type', /json/)

        .expect(201)

        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              item_name: 'Macbook Pro 2016',
              stock: 4,
              price: 10000000,
              updatedAt: expect.any(String),
              createdAt: expect.any(String),
            })
          );
        })
      })
    );
  });

  it('POST / => item name correct data type check', () => {
    return createLoginToken(app, { username: 'thohariakb', password: 'thohari123' }, function(header) {
      request(app).post('/items/add-item/').send({
        item_name: '',
        stock: 5,
        price: 10000000
      }).expect(400);
    });
    })

});