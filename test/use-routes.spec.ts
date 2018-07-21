import { Get, useRoutes } from '../src';
import express from 'express';
import request from 'supertest';
import { createRouter } from './test-helper';

class TestRouter {
  @Get('/')
  public handleRoot(req: express.Request, res: express.Response): void {
    res.end('DONE');
  }
}

describe('useRoutes()', () => {
  let router: TestRouter;
  let app: express.Router;

  beforeEach(() => {
    app = express.Router();
    router = new TestRouter();
    useRoutes(app, router);
  });

  it('should return the express router instance', () => {
    app = express.Router();
    router = new TestRouter();

    const result = useRoutes(app, router);

    expect(result).toBe(app);
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
