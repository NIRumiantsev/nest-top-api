import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Types, disconnect } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { CreateReviewDto } from "../src/review/dto";
import { REVIEW_NOT_FOUND } from "../src/review/review.constants";
import { AuthDto } from "../src/auth/dto";

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'Test',
  title: 'Test title',
  description: 'Test description',
  rating: 3,
  productId,
};

const loginDto: AuthDto = {
  login: 'logi222222n',
  password: 'passwordxxx'
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = body.access_token;
  });

  it('/review/create (POST) - success', async (done) => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set('Authorization', 'Bearer ' + token)
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
        done();
      });
  });

  it('/review/create (POST) - fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .set('Authorization', 'Bearer ' + token)
      .send({ ...testDto, rating: 0 })
      .expect(400);
  });

  it('/review/product/:productId (GET) - success', async (done) => {
    return request(app.getHttpServer())
      .get(`/review/product/${productId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
        body.forEach((review) => expect(review._id).toEqual(createdId))
        done();
      });
  });

  it('/review/product/:productId (GET) - fail', async (done) => {
    return request(app.getHttpServer())
      .get(`/review/product/${new Types.ObjectId().toHexString()}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
        done();
      });
  });

  it('/review/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);
  });

  it('/review/:id (DELETE) - fail', () => {
    return request(app.getHttpServer())
      .delete(`/review/${createdId}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(() => {
    disconnect();
  });
});
