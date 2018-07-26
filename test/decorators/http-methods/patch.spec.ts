import { Patch } from '../../../src';
import express from 'express';
import request from 'supertest';
import { createRouter } from '../../test-helper';
import bodyParser from 'body-parser';

describe('@Patch()', () => {
  it('should map a PATCH request to a bound method', async () => {
    const body = { foo: 'bar' };

    class SimplePatch {
      @Patch('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.send(body).end();
      }
    }

    const router = createRouter(new SimplePatch());

    const response = await request(router).patch('/hello');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(body);
  });

  it('should not map other types of request', async () => {
    class EmptyPatch {
      @Patch('/hello')
      public hello(_: express.Request, res: express.Response): void {
        res.status(204).end();
      }
    }

    const router = createRouter(new EmptyPatch());

    const response = await request(router).post('/hello');

    expect(response.status).toBe(404);
  });

  it('should pass in the body', async () => {
    class BodyPatch {
      @Patch('/hello')
      public hello(req: express.Request, res: express.Response): void {
        bodyParser.json()(req, res, () => {
          const body = req.body;
          res.send({ body }).end();
        })
      }
    }

    const router = createRouter(new BodyPatch());

    const body = {
      hello: 'world'
    };
    const response = await request(router).patch('/hello').send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ body });
  });

  it('should pass in headers', async () => {
    class HeadersPatch {
      @Patch('/hello')
      public hello(req: express.Request, res: express.Response): void {
        const custom = req.header('X-Custom-Header');
        const host = req.headers.host;
        res.send({ custom, host }).end();
      }
    }

    const router = createRouter(new HeadersPatch());

    const response = await request(router).patch('/hello')
      .set('Host', 'www.localhost.me')
      .set('X-Custom-Header', 'Foobar');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ custom: 'Foobar', host: 'www.localhost.me' });
  });
});
