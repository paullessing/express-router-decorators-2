import { Get, Router } from '../../src';
import express from 'express';
import { createRouter } from '../test-helper';
import request from 'supertest';

describe('@Router()', () => {
  it('should map the path as a prefix', async () => {
    const body = { success: true };
    @Router('/parent')
    class RouterWithRoute {
      @Get('/child')
      public handleChild(req: express.Request, res: express.Response) {
        res.send(body).end();
      }
    }

    const app = createRouter(new RouterWithRoute());

    const result = await request(app).get('/parent/child');

    expect(result.body).toEqual(body);
  });

  it('should not map the child routes without the prefix', async () => {
    const body = { success: true };
    @Router('/parent')
    class RouterWithRoute {
      @Get('/child')
      public handleChild(req: express.Request, res: express.Response) {
        res.send(body).end();
      }
    }

    const app = createRouter(new RouterWithRoute());

    const result = await request(app).get('/child');

    expect(result.status).toBe(404);
  });

  it('should map multiple paths', async () => {
    const body = { success: true };
    @Router('/parent1', '/parent2')
    class RouterWithRoute {
      @Get('/child')
      public handleChild(req: express.Request, res: express.Response) {
        res.send(body).end();
      }
    }

    const app = createRouter(new RouterWithRoute());

    const result1 = await request(app).get('/parent1/child');
    const result2 = await request(app).get('/parent2/child');

    expect(result1.status).toBe(200);
    expect(result2.status).toBe(200);
  });
});
