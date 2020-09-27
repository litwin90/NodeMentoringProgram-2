import { NextFunction, Request, Response } from 'express';

export interface ControllerPropertyDescriptor extends PropertyDescriptor {
    value?: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
