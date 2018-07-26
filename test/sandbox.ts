import express from 'express';
import { Get } from '../src/decorators/http-methods';
import { useRoutes } from '../src';

class Foo {
  @Get('/')
  public handle(req, res): void {
    res.send('Hello World').end();
  }
}

const app = express();
useRoutes(app, new Foo());

app.listen(3000);
