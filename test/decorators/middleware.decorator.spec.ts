import { Get, Middleware, Post } from '../../src';
import { createRouter } from '../test-helper';
import request from 'supertest';

describe('@Middleware', () => {
  it('should apply middleware to a method if the middleware is declared before the method', async () => {
    const middlewareHandler = jest.fn((req, res, next) => next());
    const methodHandler = jest.fn((req, res) => {
      res.success(200);
    });

    class MiddlwareBeforeMethod {
      @Middleware(middlewareHandler)
      @Get('/hello')
      public getHello = methodHandler;
    }

    const router = new MiddlwareBeforeMethod();

    const app = createRouter(router);

    await request(app).get('/hello');
    expect(middlewareHandler).toHaveBeenCalled();
    expect(methodHandler).toHaveBeenCalled();
  });

  it('should apply middleware to a method if the middleware is declared after the method', async () => {
    const middlewareHandler = jest.fn((req, res, next) => next());
    const methodHandler = jest.fn((req, res) => {
      res.success(200);
    });

    class MiddlwareAfterMethod {
      @Get('/hello')
      @Middleware(middlewareHandler)
      public getHello = methodHandler;
    }

    const router = new MiddlwareAfterMethod();

    const app = createRouter(router);

    await request(app).get('/hello');
    expect(middlewareHandler).toHaveBeenCalled();
    expect(methodHandler).toHaveBeenCalled();
  });

  it('should apply multiple middleware functions to a method in the order they are declared', async () => {
    const calls = [];
    const middleware1Handler = jest.fn((req, res, next) => { calls.push(1); next(); });
    const middleware2Handler = jest.fn((req, res, next) => { calls.push(2); next(); });
    const methodHandler = jest.fn((req, res) => {
      res.success(200);
    });

    class MultipleMiddlewares {
      @Middleware(middleware1Handler)
      @Middleware(middleware2Handler)
      @Get('/hello')
      public getHello = methodHandler;
    }

    const router = new MultipleMiddlewares();

    const app = createRouter(router);

    await request(app).get('/hello');
    expect(middleware1Handler).toHaveBeenCalled();
    expect(middleware2Handler).toHaveBeenCalled();
    expect(methodHandler).toHaveBeenCalled();
    expect(calls).toEqual([1, 2]);
  });

  it('should apply all middleware to all methods', async () => {
    const middleware1Handler = jest.fn((req, res, next) => next());
    const middleware2Handler = jest.fn((req, res, next) => next());
    const methodHandler = jest.fn((req, res) => {
      res.status(200).end();
    });

    class MultipleMiddlewares {
      @Middleware(middleware1Handler)
      @Get('/hello')
      @Middleware(middleware2Handler)
      @Post('/goodbye')
      public getHello = methodHandler;
    }

    const router = new MultipleMiddlewares();

    const app = createRouter(router);

    const result1 = await request(app).get('/hello');
    const result2 = await request(app).post('/goodbye');
    expect(middleware1Handler).toHaveBeenCalledTimes(2);
    expect(middleware2Handler).toHaveBeenCalledTimes(2);
    expect(methodHandler).toHaveBeenCalledTimes(2);
    expect(result1.status).toBe(200);
    expect(result2.status).toBe(200);
  });
});
