import { Get } from '../src';
import { Router } from '../src/router.decorator';
import express from 'express';

@Router()
class Foo {
  constructor(arg: string) {
    console.log('Constructed with', arg);
  }

  @Get('/')
  public handle(req, res): void {
    res.send('Hello World').end();
  }

  public greet(): void {
    console.log('Hi THere');
  }
}

const foo = new Foo('foobar');

// console.log('Is Foo', foo instanceof Foo);
// console.log(foo.prototype);

const app = express();
app.use(Router.create(foo));

app.listen(3000);
