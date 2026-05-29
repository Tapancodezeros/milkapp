const ApiResponse = require('./apiResponse');

const extractValidationMessage = (error) => {
    if (!error?.errors?.length) {
        return error.message || 'Request failed';
    }

    return error.errors.map((entry) => entry.message).join(', ');
};

const handleRouteError = (res, error) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    const details = error.details || null;

    if (error.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = extractValidationMessage(error);
    } else if (error.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = extractValidationMessage(error);
    }

    return ApiResponse.error(res, message, statusCode, details);
};

module.exports = handleRouteError;
