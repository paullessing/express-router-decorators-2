import { useRoutes } from '../src';
import express from 'express';

export function createRouter(router: any): express.Router {
  const app = express();
  useRoutes(app, router);

  return app;
}
