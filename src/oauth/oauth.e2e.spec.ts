import { INestApplication } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { createTestApp, createUser } from '../utils/test.helpers';

describe('AuthController - oauth endpoints', () => {
    let app: INestApplication;
    let userRepository: Repository<User>;

    beforeAll(async () => {
        app = await createTestApp();
        userRepository = app.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('GET /api/oauth/me', () => {
        it('should return 401 for empty request', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/oauth/me')
                .send();

            expect(response.status).toEqual(401);
        });

        it('should return 401 for invalid token (without Bearer)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/oauth/me')
                .set('Authorization', 'invalid-token')
                .send();

            expect(response.status).toEqual(401);
            expect(response.body.message).toEqual('MISSING_ACCESS_TOKEN');
            const user = await userRepository.findOneBy({
                email: 'gamer@gmail.com',
            });
            expect(user).toBeNull();
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/oauth/me')
                .set('Authorization', 'Bearer invalid-token')
                .send();

            expect(response.status).toEqual(401);
            expect(response.body.message).toEqual('INVALID_TOKEN');

            const user = await userRepository.findOneBy({
                email: 'gamer@gmail.com',
            });
            expect(user).toBeNull();
        });

        it('should return 401 for expired token', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/oauth/me')
                .set('Authorization', 'Bearer expired-token')
                .send();

            expect(response.status).toEqual(401);
            expect(response.body.message).toEqual('EXPIRED_TOKEN');
            const user = await userRepository.findOneBy({
                email: 'gamer@gmail.com',
            });
            expect(user).toBeNull();
        });

        it('should return 401 for parallel error token', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/oauth/me')
                .set('Authorization', 'Bearer parallel-token')
                .send();

            expect(response.status).toEqual(401);
            expect(response.body.message).toEqual(
                'PARALLEL_SESSION_NOT_ALLOWED',
            );
            const user = await userRepository.findOneBy({
                email: 'gamer@gmail.com',
            });
            expect(user).toBeNull();
        });

        it('should return 200 for valid token', async () => {
            const user = await createUser({
                nickname: 'gamer',
                email: 'gamer@gmail.com',
                gameSwiftID: '3e2145ab-f3f5-4ea6-a73b-ccb64338d10a',
            });

            const response = await request(app.getHttpServer())
                .get('/api/oauth/me')
                .set('Authorization', 'Bearer valid-token')
                .send();

            expect(response.status).toEqual(200);

            expect(response.body.id).toEqual(user.id);
            expect(response.body.nickname).toEqual(user.nickname);
            expect(response.body.email).toEqual(user.email);
        });
    });
});
