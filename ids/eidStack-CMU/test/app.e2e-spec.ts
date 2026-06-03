import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/issuance/schemas (GET)', () => {
    return request(app.getHttpServer())
      .get('/issuance/schemas?page=1&limit=10')
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({
          success: true,
          data: {
            items: expect.any(Array),
            total: expect.any(Number),
            page: 1,
            limit: 10,
          },
        });
      });
  });
});
