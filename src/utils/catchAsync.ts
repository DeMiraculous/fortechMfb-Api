import { Request, Response, NextFunction } from "express";


//alternative for try/catch in every ontroller
export const catchAsync = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
//catchAsyc takes an async controller function like controller.login and returns a new function that wraps fn in Promise.resolve().catch(next)
//So if fn throws (or rejects), the error is forwarded to your Express error middleware via next(error)