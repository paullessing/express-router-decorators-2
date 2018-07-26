import { Delete, Get, Post } from '../src';
import express from 'express';
import request from 'supertest';
import { createRouter } from './test-helper';

describe('useRoutes()', () => {
  it('should evaluate methods in the order they appear in the source, ignoring specificity', async () => {
    const body = { success: true };

    class MultiMethods {

      @Get('/test/specific/too-specific')
      public handleTooSpecificTest(_: express.Request, res: express.Response) {
        res.status(500).end();
      }

      @Get('/test/*')
      public handleTest(_: express.Request, res: express.Response) {
        res.send(body).end();
      }

      @Get('/test/specific')
      public handleSpecificTest(_: express.Request, res: express.Response) {
        res.status(500).end();
      }

      @Get('*')
      public catchAll(_: express.Request, res: express.Response) {
        res.status(500).end();
      }
    }

    const router = createRouter(new MultiMethods());
    const response = await request(router).get('/test/specific');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(body);
  });

  it('should evaluate specific methods before ones with router params if the specific ones come first', async () => {
    const body = { success: true };

    class SpecificAndGenericMethods {

      @Get('/test/specific')
      public handleSpecific(_: express.Request, res: express.Response) {
        res.send(body).end();
      }

      @Get('/test/:id')
      public handleGeneric(_: express.Request, res: express.Response) {
        res.status(500).end();
      }
    }

    const router = createRouter(new SpecificAndGenericMethods());
    const response = await request(router).get('/test/specific');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(body);
  });

  it('should evaluate methods with router params before specific ones if the specific ones come first ' +
    '(this is usually wrong setup, but we want to be consistent)', async () => {
    const body = { success: true };

    class SpecificAndGenericMethods {

      @Get('/test/:id')
      public handleGeneric(_: express.Request, res: express.Response) {
        res.send(body).end();
      }

      @Get('/test/specific')
      public handleSpecific(_: express.Request, res: express.Response) {
        res.status(500).end();
      }
    }

    const router = createRouter(new SpecificAndGenericMethods());
    const response = await request(router).get('/test/specific');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(body);
  });

  it('should map one method to multiple routes if they are all bound', async () => {
    class MultiRoutes {
      @Get('/hello')
      @Get('/bye')
      @Post('/hello')
      @Delete('/greeting')
      public manage: jest.Mock;

      constructor() {
        this.manage = jest.fn();
        this.manage.mockImplementation((_: express.Request, res: express.Response) => {
          res.end();
        });
      }
    }

    const router = new MultiRoutes();
    const app = createRouter(router);

    await request(app).get('/hello');
    await request(app).get('/hello');
    await request(app).post('/hello');
    await request(app).delete('/greeting');

    expect(router.manage).toHaveBeenCalledTimes(4);
    expect(router.manage.mock.calls[0][0].method).toBe('GET');
    expect(router.manage.mock.calls[0][0].path).toBe('/hello');
    expect(router.manage.mock.calls[1][0].method).toBe('GET');
    expect(router.manage.mock.calls[1][0].path).toBe('/hello');
    expect(router.manage.mock.calls[2][0].method).toBe('POST');
    expect(router.manage.mock.calls[2][0].path).toBe('/hello');
    expect(router.manage.mock.calls[3][0].method).toBe('DELETE');
    expect(router.manage.mock.calls[3][0].path).toBe('/greeting');
  });
});
