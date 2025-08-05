"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = void 0;
//alternative for try/catch in every ontroller
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.catchAsync = catchAsync;
//catchAsyc takes an async controller function like controller.login and returns a new function that wraps fn in Promise.resolve().catch(next)
//So if fn throws (or rejects), the error is forwarded to your Express error middleware via next(error)
