import { Get } from '../src/http-methods';
import * as express from 'express';
import { useRoutes } from '../src';

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
});
