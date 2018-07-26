import { Get, Use } from '../../src';
import express from 'express';
import { createRouter } from '../test-helper';
import request from 'supertest';

describe('@Use()', () => {
  it('should treat the method as middleware for all subsequent endpoints when applied to a method', async () => {
    const body = { success: true };
    let useCalled = false;
    class RouterWithUse {
      @Use('/hello')
      public use(req: express.Request, res: express.Response, next: express.NextFunction): void {
        useCalled = true;
        next();
      }

      @Get('/hello')
      public getHello(req: express.Request, res: express.Response): void {
        res.send(body).end();
      }
    }

    const app = createRouter(new RouterWithUse());

    const result = await request(app).get('/hello');
    expect(result.body).toEqual(body);
    expect(useCalled).toBe(true);
  });

  it('should treat the method as middleware for all subsequent endpoints when applied to a property that is a function', async () => {
    const body = { success: true };
    class RouterWithUse {
      @Use('/hello')
      public use = jest.fn((req: express.Request, res: express.Response, next: express.NextFunction): void => {
        next();
      });

      @Get('/hello')
      public getHello(req: express.Request, res: express.Response): void {
        res.send(body).end();
      }
    }

    const router = new RouterWithUse();
    const app = createRouter(router);

    const result = await request(app).get('/hello');
    expect(result.body).toEqual(body);
    expect(router.use).toHaveBeenCalled();
  });

  it('should not treat the method as middleware for preceding endpoints', async () => {
    const body = { success: true };
    let useCalled = false;
    class RouterWithUse {
      @Get('/hello')
      public getHello(req: express.Request, res: express.Response): void {
        res.send(body).end();
      }

      @Use('/hello')
      public use(req: express.Request, res: express.Response, next: express.NextFunction): void {
        useCalled = true;
        next();
      }
    }

    const app = createRouter(new RouterWithUse());

    const result = await request(app).get('/hello');
    expect(result.body).toEqual(body);
    expect(useCalled).toBe(false);
  });

  it('should treat the property as a child router when applied to an object property', async () => {
    const body = { success: true };
    class ChildRouter {
      @Get('/hello')
      public getHello(req: express.Request, res: express.Response): void {
        res.send(body).end();
      }
    }

    class ParentRouter {
      @Use('/child')
      public childRouter = new ChildRouter();
    }

    const app = createRouter(new ParentRouter());

    const result = await request(app).get('/child/hello');
    expect(result.body).toEqual(body);
  });
});
