import { Response } from '../src';

describe('Response', () => {
  describe('#constructor()', () => {
    it('should map the status code', () => {
      const statusCode = 999;
      const result = new Response(statusCode);

      expect(result.status).toBe(statusCode);
    });

    it('should set the body, and set its type to "text" if it is a string', () => {
      const body = 'Hello World';
      const result = new Response(200, body);

      expect(result.body).toBe(body);
      expect(result.type).toBe('text');
    });

    it('should set the body, and set its type to "json" if it is an object', () => {
      const body = { success: true };
      const result = new Response(200, body);

      expect(result.body).toEqual(body);
      expect(result.type).toBe('json');
    });

    it('should set the body, and set its type to "json" if it is an array', () => {
      const body = ['a', 1];
      const result = new Response(200, body);

      expect(result.body).toEqual(body);
      expect(result.type).toBe('json');
    });
  });

  describe('#success()', () => {
  });
  describe('#error()', () => {
  });
  describe('#resolve()', () => {
  });
  describe('#reject()', () => {
  });
});
