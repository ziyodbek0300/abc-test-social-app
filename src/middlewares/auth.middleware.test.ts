import request from 'supertest';
import { app } from '../index';
import { config } from '../config';

describe('Authorization Middleware', () => {
    const secret = config.secret;
    const invalidToken = 'invalid.token.here';

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .post('/api/publications')
            .send({ title: 'Test Publication', content: 'Test Content' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('No token provided');
    });

    it('should return 401 if an invalid token is provided', async () => {
        const response = await request(app)
            .post('/api/publications')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send({ title: 'Test Publication', content: 'Test Content' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid token');
    });
});