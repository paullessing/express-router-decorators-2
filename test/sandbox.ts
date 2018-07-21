import * as express from 'express';
import { Get } from '../src/http-methods';
import { useRoutes } from '../src';

class Foo {
  @Get('/')
  public handle(): void {}
}

const app = express.Router();
useRoutes(app, new Foo());
