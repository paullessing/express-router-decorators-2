import { Handler } from 'express';
import { addEndpointMetadata } from '../metadata';

// TODO this should be available on a class level, too
export function Middleware(handler: Handler): MethodDecorator & PropertyDecorator {
  return <T = any>(
    target: Object,
    property: string | symbol,
    // descriptor?: TypedPropertyDescriptor<T> // Only used for Methods
  ): TypedPropertyDescriptor<T> | void => {
    addEndpointMetadata(target, {
      type: 'middleware',
      property,
      handler
    });
  };
}
