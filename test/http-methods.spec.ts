import { Get, useRoutes } from '../src';
import express from 'express';
import request from 'supertest';

describe('@Get()', () => {
  let app: express.Router;

  const createRouter = (router: any): express.Router => {
    app = express();
    useRoutes(app, router);

    return app;
  };

  it('should bind GET annotations on a method to the root URL', async () => {
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
});
