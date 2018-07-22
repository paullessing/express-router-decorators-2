import { Get } from '../src';
import { Router } from '../src/router.decorator';

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

const foo = new Foo('foobar') as any;

foo();

console.log('Is Foo', foo instanceof Foo);
console.log(foo.prototype);

foo.greet();

//
// const app = express();
// const foo = new Foo() as any;
// app.use(foo);
//
// app.listen(3000);
