import {
    ValidationError,
    ApplicationError,
    AuthorizationError
} from './errors';

export function errorMiddleware(err, req, res, next){
    let formatedError = err;
    if(err instanceof ValidationError){
        formatedError = err;
    }else if(err instanceof AuthorizationError){
        formatedError = err;
    }else if(err instanceof Error) {
        formatedError = new ApplicationError()
    }
    let { error, status } = formatedError;
    return res.status(status).json({
        error
    });
    
}