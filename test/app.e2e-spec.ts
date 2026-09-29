import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';
import { configureApp } from './../src/app.setup.js';

// Needs the database from docker-compose.yaml: docker compose up -d
describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health returns the standard response', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('X-Request-Id', /.+/)
      .expect({ status: 200, message: 'Success', data: { database: 'up' } });
  });

  it('unknown routes return the standard error response', () => {
    return request(app.getHttpServer())
      .get('/does-not-exist')
      .expect(404)
      .expect((res) => {
        expect(res.body).toMatchObject({ status: 404, data: null });
      });
  });
});
