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


describe('Get List Customer', () => {
  it('return list customer and status 200 when token is provided', () => {
    request(app)
      .get('/customer/list-customer')
      .set('token', token)
      .expect(200)
  });
});

describe('Register and Login', () => {
  describe('POST /customer/register-customer', () => {
    it('register a new user', async () => {
      const res = await request(app)
        .post('/customer/register-customer')
        .send({
          fullname: 'New Customer',
          username: 'newcustomer',
          password: 'new12345',
          email: 'newcustomer@example.com',
          phone: "123456789",
          gender: "Male",
          dob: "1970-05-15",
        });

      expect(200)
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('customer_id');
      expect(res.body.data).toHaveProperty('fullname');
      expect(res.body.data).toHaveProperty('username');
      expect(res.body.data).toHaveProperty('password');
      expect(res.body.data).toHaveProperty('email');
      expect(res.body.data).toHaveProperty('phone');
      expect(res.body.data).toHaveProperty('gender');
      expect(res.body.data).toHaveProperty('dob');
      expect(res.body.data).toHaveProperty('status');
      expect(res.body.data).toHaveProperty('updatedAt');
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('message');
    });

    it('not register a new customer with an existing email', async () => {
      const res = await request(app)
        .post('/customer/register-customer')
        .send({
          fullname: 'New Customer',
          username: 'newcustomer',
          password: 'new12345',
          email: 'newcustomer@example.com',
          phone: "123456789",
          gender: "Male",
          dob: "1970-05-15",
        });

      expect(400)
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('message', 'Username or Email already in use');
    });
  });

  describe('POST /customer/login-customer', () => {
    it('login user with valid credentials', async () => {
      const res = await request(app)
        .post('/customer/login-customer')
        .send({
          username: 'newcustomer',
          password: 'new12345'
        });

      expect(200)
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('token');
    });

    it('not login a customer with invalid credentials', async () => {
      const res = await request(app)
        .post('/customer/login-customer')
        .send({
            username: 'newcustomer',
            password: 'new1234ad'
        });

      expect(res.statusCode).toEqual(400);
    });
  });
});
