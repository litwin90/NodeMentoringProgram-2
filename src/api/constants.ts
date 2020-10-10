export enum HttpCode {
    Ok = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    UnprocessableEntity = 422,
    InternalServerError = 500,
    Unavailable = 503,
}

export enum HttpMessage {
    Ok = 'Ok',
    Created = 'Created',
    NoContent = ' No Content',
    BadRequest = 'Bad Request',
    Unauthorized = 'Unauthorized',
    Forbidden = ' Forbidden',
    NotFound = 'Not Found',
    Conflict = 'Conflict',
    UnprocessableEntity = 'Unprocessable Entity',
    InternalServerError = 'Internal Server Error',
    Unavailable = 'Unavailable',
}
