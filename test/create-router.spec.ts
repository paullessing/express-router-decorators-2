import { Get } from '../src/http-methods';
import * as express from 'express';
import { useRoutes } from '../src';
import request from 'supertest';

class TestRouter {
  @Get('/')
  public handleRoot(req: express.Request): void {
    return null;
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

  it('should bind GET annotations on a method to the root URL', async () => {
    const response = await request(app).get('/') as request.Response;

    expect(response.status).toBe(200);
  });
});
