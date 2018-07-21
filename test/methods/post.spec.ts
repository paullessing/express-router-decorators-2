import { Post } from '../../src';
import express from 'express';
import request from 'supertest';
import { createRouter } from '../test-helper';
import bodyParser = require('body-parser');

describe('@Post()', () => {
  it('should map a POST request to a bound method', async () => {
    const body = { foo: 'bar' };

    class SimplePost {
      @Post('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.send(body).end();
      }
    }

    const router = createRouter(new SimplePost());

    const response = await request(router).post('/hello');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(body);
  });

  it('should not map other types of request', async () => {
    class EmptyPost {
      @Post('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.status(204).end();
      }
    }

    const router = createRouter(new EmptyPost());

    const response = await request(router).patch('/hello');

    expect(response.status).toBe(404);
  });

  it('should pass in the body', async () => {
    class BodyPost {
      @Post('/hello')
      public hello(req: express.Request, res: express.Response): void {
        bodyParser.json()(req, res, () => {
          const body = req.body;
          res.send({ body }).end();
        })
      }
    }

    const router = createRouter(new BodyPost());

    const body = {
      hello: 'world'
    };
    const response = await request(router).post('/hello').send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ body });
  });

  it('should pass in headers', async () => {
    class HeadersPost {
      @Post('/hello')
      public hello(req: express.Request, res: express.Response): void {
        const custom = req.header('X-Custom-Header');
        const host = req.headers.host;
        res.send({ custom, host }).end();
      }
    }

    const router = createRouter(new HeadersPost());

    const response = await request(router).post('/hello')
      .set('Host', 'www.localhost.me')
      .set('X-Custom-Header', 'Foobar');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ custom: 'Foobar', host: 'www.localhost.me' });
  });
});
