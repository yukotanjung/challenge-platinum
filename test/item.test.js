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

describe('Items', () => {
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

  it('GET /items/detail-item/ => a item by item ID', () => {
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

  it('POST /items/add-item/ => create a new item', () => {
    return (
      createLoginToken(app, { username: 'admin', password: 'admin' }, function(header) {
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

  it('POST /items/add-item/ => item name correct data type check', () => {
    return createLoginToken(app, { username: 'admin', password: 'admin' }, function(header) {
      request(app).post('/items/add-item/').send({
        item_name: '',
        stock: 5,
        price: 10000000
      }).expect(400);
    });
    })

    it('PUT /items/update-item/ => update an item', () => {
      return (
        createLoginToken(app, { username: 'admin', password: 'admin' }, function(header) {
          request(app)
          .put('/items/update-item/')
  
          // Item send code
  
          .set('Authorization', header)
          .send({
            item_id: 1,
            item_name: 'Macbook Pro 16gb 2019',
            stock: 7,
            price: 20000000,
            status: 1
          })
  
          .expect('Content-Type', /json/)
  
          .expect(200)
        })
      );
    });
  
    it('UPDATE /items/update-item/ => item name correct data type check', () => {
      return createLoginToken(app, { username: 'admin', password: 'admin' }, function(header) {
        request(app).put('/items/update-item/').send({
          item_id: 1,
          item_name: '',
          stock: 7,
          price: 20000000,
          status: 1
        }).expect(400);
      });
      })

});
