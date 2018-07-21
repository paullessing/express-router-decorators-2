import { Options } from '../../src';
import express from 'express';
import request from 'supertest';
import { createRouter } from '../test-helper';

describe('@Options()', () => {
  it('should map a OPTIONS request to a bound method', async () => {
    const body = { foo: 'bar' };

    class SimpleOptions {
      @Options('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.send(body).end();
      }
    }

    const router = createRouter(new SimpleOptions());

    const response = await request(router).options('/hello');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(body);
  });

  it('should not map other types of request', async () => {
    class EmptyOptions {
      @Options('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.status(204).end();
      }
    }

    const router = createRouter(new EmptyOptions());

    const response = await request(router).post('/hello');

    expect(response.status).toBe(404);
  });

  it('should pass in query parameters', async () => {
    class QueryOptions {
      @Options('/hello')
      public hello(req: express.Request, res: express.Response): void {
        const name = req.query.name;
        res.send({ name }).end();
      }
    }

    const router = createRouter(new QueryOptions());

    const response = await request(router).options('/hello?name=Foo');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ name: 'Foo' });
  });

  it('should pass in headers', async () => {
    class HeadersOptions {
      @Options('/hello')
      public hello(req: express.Request, res: express.Response): void {
        const custom = req.header('X-Custom-Header');
        const host = req.headers.host;
        res.send({ custom, host }).end();
      }
    }

    const router = createRouter(new HeadersOptions());

    const response = await request(router).options('/hello')
      .set('Host', 'www.localhost.me')
      .set('X-Custom-Header', 'Foobar');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ custom: 'Foobar', host: 'www.localhost.me' });
  });
});
