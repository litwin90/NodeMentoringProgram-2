export enum HttpCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    INTERNAL_SERVER_ERROR = 500,
    UNAVAILABLE = 503,
}

export enum HttpMessage {
    OK = 'Ok',
    CREATED = 'Created',
    NO_CONTENT = ' No Content',
    BAD_REQUEST = 'Bad Request',
    FORBIDDEN = ' Forbidden',
    NOT_FOUND = 'Not Found',
    CONFLICT = 'Conflict',
    UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
    INTERNAL_SERVER_ERROR = 'Internal Server Error',
    UNAVAILABLE = 'Unavailable',
}
