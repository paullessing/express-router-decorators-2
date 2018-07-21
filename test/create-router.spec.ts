import { createRouter } from '../src';

class TestRouter {
}

describe('createRouter()', () => {
  it('should create a router instance', () => {
    const router = new TestRouter();

    const result = createRouter(router);

    expect(typeof result.use).toBe('function');
  });
});
