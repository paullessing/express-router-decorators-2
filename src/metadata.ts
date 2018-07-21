export const METADATA_KEY_METHODS = 'express-router-decorators:methods';

export type PathParams = string | RegExp | (string | RegExp)[];
export type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

export interface MethodDefinition {
  property: string | symbol;
  method: HttpVerb;
  path: PathParams;
}
