const request = require('supertest');
const app = require('../../api/index');

describe('POST /api/reservation', () => {
    it('should return a validation error if the request payload is invalid', async () => {
        const invalidPayload = {
            email: 'invalid',
            matchNumber: 'invalid',
            tickets: {
                category: 'invalid',
                quantity: -1,
                price: -1,
            },
            card: {
                number: 'invalid',
                expirationMonth: 'invalid',
                expirationYear: 'invalid',
                cvc: 'invalid',
            },
        };

        const res = await request(app)
            .post('/api/reservation')
            .send(invalidPayload);

        expect(res.statusCode).toEqual(403);
        expect(res.text).toEqual('Invalid payload');
    });

    it('should return an error if the Stripe payment fails', async () => {
        const invalidCardPayload = {
            email: 'valid@example.com',
            matchNumber: 14,
            tickets: {
                category: 2,
                quantity: 1,
                price: 125,
            },
            card: {
                number: '4000000000000341',
                expirationMonth: 12,
                expirationYear: 2022,
                cvc: 123,
            },
        };

        const res = await request(app)
            .post('/api/reservation')
            .send(invalidCardPayload);

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual('could not process payment: Your card was declined.');
    });

    it('should create a new ticket reservation if the payload is valid and the Stripe payment succeeds', async () => {
        const validPayload = {
            email: 'valid@example.com',
            matchNumber: 14,
            tickets: {
                category: 2,
                quantity: 1,
                price: 125,
            },
            card: {
                number: '4000000000000259',
                expirationMonth: 12,
                expirationYear: 2022,
                cvc: 123,
            },
        };

        const res = await request(app)
            .post('/api/reservation')
            .send(validPayload);

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual('Ticket Purchase Successful');
        expect(res.body.referenceId).toBeDefined();
    });
});
