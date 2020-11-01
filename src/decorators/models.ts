import { NextFunction, Request, Response } from 'express';

export interface ControllerPropertyDescriptor extends PropertyDescriptor {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: (req: Request, res: Response, next: NextFunction) => Promise<Response<any>>;
}
