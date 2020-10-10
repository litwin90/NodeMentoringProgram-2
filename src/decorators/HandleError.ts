import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

import { apiLogger } from '../logger';
import { ControllerPropertyDescriptor } from './models';

export function HandleError() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target: any, propertyKey: string, descriptor: ControllerPropertyDescriptor) => {
        const originalMethod = descriptor.value;

        if (originalMethod) {
            descriptor.value = async (req: Request, res: Response, next: NextFunction) => {
                const context = Container.get(target.constructor);
                const methodName = propertyKey;
                const controllerName = target.constructor.name;

                return originalMethod.apply(context, [req, res, next]).catch((error: Error) => {
                    const errorObject = {
                        controller: controllerName,
                        method: methodName,
                        arguments: req.body,
                        error,
                    };
                    apiLogger.error(JSON.stringify(errorObject, null, 4));
                    return next(error);
                });
            };
        }
    };
}
