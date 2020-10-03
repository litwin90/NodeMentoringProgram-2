import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';

import { apiLogger } from '../logger';
import { ControllerPropertyDescriptor } from './models';

export function LogRequestData() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (target: any, propertyKey: string, descriptor: ControllerPropertyDescriptor) => {
        const originalMethod = descriptor.value;

        if (originalMethod) {
            descriptor.value = async (req: Request, res: Response, next: NextFunction) => {
                const context = Container.get(target.constructor);
                const methodName = propertyKey;
                const controllerName = target.constructor.name as string;

                originalMethod.apply(context, [req, res, next]).then(() => {
                    const requestData = {
                        controller: controllerName,
                        method: methodName,
                        arguments: { ...req.body, ...req.params },
                    };
                    apiLogger.info(requestData);
                });
            };
        }
    };
}
