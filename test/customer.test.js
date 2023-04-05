const request = require('supertest')
const app = require('../server');

function createLoginToken(server, loginDetails, done) {
    request(server)
        .post('/login')
        .send(loginDetails)
        .end(function (error, response) {
            if (error) {
                throw error;
            }
            let loginToken = response.body.token;
            done(loginToken);
        });
}


describe('GET /', () => {

    it('Get list of customer"', (done) => {
        request(app)
            .get('/customer/list-customer')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                return done(
                    expect(res.body.data[0]).toEqual(
                        expect.objectContaining({
                            fullname: expect.any(String),
                            username: expect.any(String),
                            email: expect.any(String),
                            gender: expect.any(String),
                            dob: expect.any(String),
                            status: expect.any(Number),
                            createdAt: expect.any(String),
                        })
                    )
                )
            });
    });


    it('Get Customer Profile"', async(done) => {
        createLoginToken(app, {username: 'test', password: 'test1234'}, (header)=>{
            request(app)

            .get('/customer/profile')
            .set('Authorization', header)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                return done(
                    expect(res.body.data).toEqual(
                        expect.objectContaining({
                            customer_id: expect.any(Number),
                            fullname: expect.any(String),
                            username: expect.any(String),
                            password: expect.any(String),
                            email: expect.any(String),
                            phone: expect.any(String),
                            gender: expect.any(String),
                            dob: expect.any(String),
                            status: expect.any(Number),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String),
                        })
                    )
                )
            });
        })
        
    });

})


describe('POST /', () => {

    describe('Registering new Customer', ()=> {
        it('all data valid', async (done) => {
            //jest.setTimeout(120000);
            var payload = {
                fullname: "jono2",
                username: "jono5",
                password: "jono12345",
                email: "jono@gmail.com",
                phone: "123456789",
                gender: "Male",
                dob: "1997-06-25",
            }
    
            const res = await request(app)
                .post('/customer/register-customer')
                .send(payload)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            
                expect(res.statusCode).toEqual(200)
    
        })

        it('missing one or more payload', async (done) => {
            //jest.setTimeout(120000);
            var payload = {
                fullname: "jono2",
                username: "jono5",
                password: "jono12345",
                email: "jono@gmail.com",
                phone: "123456789",
                gender: "Male",
            }
    
            const res = await request(app)
                .post('/customer/register-customer')
                .send(payload)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            
                expect(res.statusCode).toEqual(400)
    
        })
    
    })


    describe('Login Customer', ()=>{
        it('Login Customer With correct username and password', async (done)=>{
            //jest.setTimeout(120000);
            var payload = {
                username: "test",
                password: "test1234",
            }

            const res = await request(app)
            .post('/customer/login-customer')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

            expect(res.statusCode).toEqual(200)
            expect(res.body).toEqual(
                expect.objectContaining({
                    status: expect.any(Number),
                    message: expect.any(String),
                    token: expect.any(String)
                })
            )
        })


        it('Login Customer With wrong username and password', async (done)=>{
            //jest.setTimeout(120000);
            var payload = {
                username: "test1",
                password: "test1234",
            }

            const res = await request(app)
            .post('/customer/login-customer')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')

            expect(res.statusCode).toEqual(400)
            
        })
    })

    

})
