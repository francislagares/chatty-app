import { JoiRequestValidationError } from '@/shared/global/helpers/ErrorHandler';
import { Request } from 'express';
import { ObjectSchema } from 'joi';

type JoiDecorator = (
  target: any,
  key: string,
  descriptor: PropertyDescriptor,
) => void;

export const joiValidation = (schema: ObjectSchema): JoiDecorator => {
  return (_target: any, _key: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const req: Request = args[0];
      const { error } = await Promise.resolve(schema.validate(req.body));

      if (error?.details) {
        throw new JoiRequestValidationError(error.details[0].message);
      }

      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
};
