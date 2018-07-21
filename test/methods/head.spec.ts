import { Head } from '../../src';
import express from 'express';
import request from 'supertest';
import { createRouter } from '../test-helper';

describe('@Head()', () => {
  it('should map a HEAD request to a bound method', async () => {
    class SimpleHead {
      @Head('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.header('X-Response-Sent', 'yes').end();
      }
    }

    const router = createRouter(new SimpleHead());

    const response = await request(router).head('/hello');

    expect(response.status).toBe(200);
    expect(response.get('X-Response-Sent')).toBe('yes');
  });

  it('should not map other types of request', async () => {
    class EmptyHead {
      @Head('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.status(204).end();
      }
    }

    const router = createRouter(new EmptyHead());

    const response = await request(router).post('/hello');

    expect(response.status).toBe(404);
  });

  it('should pass in query parameters', async () => {
    class QueryHead {
      @Head('/hello')
      public hello(req: express.Request, res: express.Response): void {
        const name = req.query.name;
        res.header('X-Query-Value', name).end();
      }
    }

    const router = createRouter(new QueryHead());

    const response = await request(router).head('/hello?name=Foo');

    expect(response.status).toBe(200);
    expect(response.get('X-Query-Value')).toBe('Foo');
  });

  it('should pass in headers', async () => {
    class HeadersHead {
      @Head('/hello')
      public hello(req: express.Request, res: express.Response): void {
        const custom = req.header('X-Custom-Header');
        const host = req.headers.host;
        res
          .header('X-Custom-Header-Received', custom)
          .header('X-Host-Header-Received', host)
          .end();
      }
    }

    const router = createRouter(new HeadersHead());

    const response = await request(router).head('/hello')
      .set('Host', 'www.localhost.me')
      .set('X-Custom-Header', 'Foobar');

    expect(response.status).toBe(200);
    expect(response.get('X-Custom-Header-Received')).toBe('Foobar');
    expect(response.get('X-Host-Header-Received')).toBe('www.localhost.me');
  });
});
