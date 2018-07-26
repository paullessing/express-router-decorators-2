# Express Router Decorators
A way of managing Express routes in a declarative way. Particularly useful for router classes with dependency injection.

## Usage
Without decorators:
```
// app.ts
import express from 'express';

const app = express();
app.get('/', (req, res) => {
  res.send('hello').end();
});
app.use('/user/*', (req, res, next) => {
  if (userService.isAuthenticated(req)) {
    next();
  } else {
    res.status(401).end();
  }
});
app.put('/user/profile', (req, res) => {
  userService.updateProfile(req).then((profile) => {
    res.send(profile).end();
  });
});

export = app;
```

With decorators:
```
// router.ts
import { Get, Use, Put } from 'express-router-decorators';

export class Router {
  constructor(
    private userService
  ) {}

  @Get('/')
  public hello(): string {
    return 'hello';
  }
  
  @Use('/user/*')
  public authenticateUserRequests(req, res, next): void {
    if (this.userService.isAuthenticated(req)) {
      next();
    } else {
      res.status(401).end();
    }
  }
  
  @Put('/user/profile')
  public updateProfile(req): Promise<Profile> {
    return this.userService.updateProfile(req);
  }
}
```
```
// app.ts
import express from 'express';
import { useRoutes } from 'express-router-decorators';
import { Router } from './router';

const app = express;
const router = dependencyInjectionContainer.get(Router);

useRoutes(app, router);

export = app;
```


## Middleware
To apply a static middleware function, use the `@Middleware` decorator:
```
const transformRequest = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  // ... do some logic here
  next();
};

class Router {
  @Middleware(transformRequest)
  @Get('/')
  public handleRequest(req: express.Request, res: express.Response): void {
    // ...
  }
}
```
You can apply multiple middleware; they will be evaluated in source order:
```
@Middleware(function1) // Executed first
@Middleware(function2) // Executed second
@Get('/')
```

Middleware will apply to all request types on the method:
```
@Middleware(middleware) // Executed on GET / and on POST /post
@Get('/')
@Post('/post');
```
