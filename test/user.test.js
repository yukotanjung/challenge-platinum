const request = require('supertest');
const app = require('../server');
const db = require('../models');
const jwt = require('jsonwebtoken');


const user = {
  username: 'newuser',
  password: 'new1234'
};


let token;

beforeAll(async () => {

  await db.sequelize.sync();
  await request(app)
    .post('/users/user-login')
    .send(user);
    token = jwt.sign({ userid:1, type:'admin' }, 'yuko-binar');
});

afterAll(async () => {
  await db.sequelize.close();
});


describe('Get List User', () => {
  it('return list user and status 200 when token is provided', () => {
    request(app)
      .get('/users/user')
      .set('token', token)
      .expect(200)
  });
});

describe('Register and Login', () => {
  describe('POST /users/add-user', () => {
    it('register a new user', async () => {
      const res = await request(app)
        .post('/users/add-user')
        .send({
          username: 'newuser',
          password: 'new1234',
          fullname: 'new1234',
          email: 'newuser@example.com',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('input_date');
      expect(res.body.data).toHaveProperty('userid');
      expect(res.body.data).toHaveProperty('username');
      expect(res.body.data).toHaveProperty('password');
      expect(res.body.data).toHaveProperty('fullname');
      expect(res.body.data).toHaveProperty('email');
      expect(res.body.data).toHaveProperty('status');
    });

    it('not register a new user with an existing email', async () => {
      const res = await request(app)
        .post('/users/add-user')
        .send({
            username: 'newuser',
            password: 'new1234',
            fullname: 'new1234',
            email: 'newuser@example.com',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('message', 'Username or Email already in use');
    });
  });

  describe('POST /users/user-login', () => {
    it('login user with valid credentials', async () => {
      const res = await request(app)
        .post('/users/user-login')
        .send({
          username: 'newuser',
          password: 'new1234'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('token');
    });

    it('not login a user with invalid credentials', async () => {
      const res = await request(app)
        .post('/users/user-login')
        .send({
            username: 'newuser',
            password: 'new1234ad'
        });

      expect(res.statusCode).toEqual(400);
    });
  });
});
