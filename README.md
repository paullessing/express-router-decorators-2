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

## Router
To map an entire router to a path (or a set of paths), use the `@Router` decorator:
```
@Router('/user')
class UserRouter {
  @Get('profile) // Accessible under /user/profile
  public getProfile(req: express.Request, res: express.Response): void {
    // ...
  }
}
```

## Middleware
There are two ways of applying middleware to a method: statically or as properties.

### Static Middleware
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

### Property Middleware
The equivalent to using Express's `.use()` method is the `@Use()` decorator:
```
@Post('/user') // NOT Authenticated since it appears before the @Use declaration
public getUserDetails(req: express.Request, res: express.Response): void {
  // ...
}

@Use('/user')
public authenticate(req: express.Request, res: express.Response, next: express.NextFunction): void {
  if (this.authenticationService.isAuthenticated(req)) {
    next();
  } else {
    res.status(401).end();
  }
}

@Get('/user/me') // Authenticated by the "authenticate" function
public getUserDetails(req: express.Request, res: express.Response): void {
  // ...
}

@Get('/login') // NOT Authenticated since the URL does not match
public getUserDetails(req: express.Request, res: express.Response): void {
  // ...
}
```

## Child Routers
To declare a child router, use the `@Use` declaration on a property that's not a function.

This will call `useRoutes()` on that object and treat it as a new router.

```
class BaseRouter {
  @Use('/user')
  public userRouter: UserRouter;
}

class UserRouter {
  @Get('/profile') // Calls to /user/profile will map here
  public getProfile(...) {...}
}
```
