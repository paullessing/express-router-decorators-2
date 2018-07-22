import { METADATA_KEY_METHODS, PathParams } from './metadata';
import 'reflect-metadata';

export function Router(path?: PathParams): ClassDecorator {
  return <Constructr extends Function>(target: Constructr): Constructr => {
    class RouterAndClass {
      constructor(...args: any[]) {
        console.log('Has Metadata', Reflect.hasMetadata(METADATA_KEY_METHODS, target));

        const router = function(req, res, next) {
          // const expressRouter = express.Router();
        };
        const newTarget = new (target as any)(...args);
        Object.setPrototypeOf(router, Object.getPrototypeOf(newTarget));
        Object.assign(router, newTarget);
        return router;
      }
    }

    return RouterAndClass as any as Constructr;
  };
}
