import { addEndpointMetadata, PathParams } from '../metadata';

export function Use(path: PathParams): MethodDecorator & PropertyDecorator {
  return <T = any>(
    target: Object,
    property: string | symbol,
    // descriptor?: TypedPropertyDescriptor<T> // Only used for Methods
  ): TypedPropertyDescriptor<T> | void => {
    addEndpointMetadata(target, {
      type: 'use',
      property,
      path
    });
  };
}
