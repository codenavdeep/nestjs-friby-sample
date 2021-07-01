import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as frisby from 'frisby';
import { AppModule } from '../src/app.module';

const Joi = frisby.Joi; // Frisby exposes Joi for convenience

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World! Huuuray!!!');
  });
});

describe('Posts', function () {
  it('should return all posts and first post should have comments', function () {
    return frisby.get('http://jsonplaceholder.typicode.com/posts')
        .expect('status', 200)
        .expect('jsonTypes', '*', {
          userId: Joi.number(),
          id: Joi.number(),
          title: Joi.string(),
          body: Joi.string()
        })
        .then(function (res) { // res = FrisbyResponse object
          let postId = res.json[0].id;

          // Get first post's comments
          // RETURN the FrisbySpec object so function waits on it to finish - just like a Promise chain
          return frisby.get('http://jsonplaceholder.typicode.com/posts/' + postId + '/comments')
              .expect('status', 200)
              .expect('json', '*', {
                postId: postId
              })
              .expect('jsonTypes', '*', {
                postId: Joi.number(),
                id: Joi.number(),
                name: Joi.string(),
                email: Joi.string().email(),
                body: Joi.string()
              });
        });
  });
});

describe('Items', function () {
    it('Get Items', function () {
        return frisby.get('http://localhost:3000/items')
            .expect('status', 200)
            .then(function (res) {
                const responseBody = res._body
                console.log(JSON.stringify(responseBody))
            });
    });
});
