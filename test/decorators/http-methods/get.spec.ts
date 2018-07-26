import { Get } from '../../../src';
import express from 'express';
import request from 'supertest';
import { createRouter } from '../../test-helper';

describe('@Get()', () => {
  it('should map a GET request to a bound method', async () => {
    const body = { foo: 'bar' };

    class SimpleGet {
      @Get('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.send(body).end();
      }
    }

    const router = createRouter(new SimpleGet());

    const response = await request(router).get('/hello');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(body);
  });

  it('should not map other types of request', async () => {
    class EmptyGet {
      @Get('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.status(204).end();
      }
    }

    const router = createRouter(new EmptyGet());

    const response = await request(router).post('/hello');

    expect(response.status).toBe(404);
  });

  it('should pass in query parameters', async () => {
    class QueryGet {
      @Get('/hello')
      public hello(req: express.Request, res: express.Response): void {
        const name = req.query.name;
        res.send({ name }).end();
      }
    }

    const router = createRouter(new QueryGet());

    const response = await request(router).get('/hello?name=Foo');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: 'Foo' });
  });

  it('should pass in headers', async () => {
    class HeadersGet {
      @Get('/hello')
      public hello(req: express.Request, res: express.Response): void {
        const custom = req.header('X-Custom-Header');
        const host = req.headers.host;
        res.send({ custom, host }).end();
      }
    }

    const router = createRouter(new HeadersGet());

    const response = await request(router).get('/hello')
      .set('Host', 'www.localhost.me')
      .set('X-Custom-Header', 'Foobar');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ custom: 'Foobar', host: 'www.localhost.me' });
  });
});
