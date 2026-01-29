// A custom error class for handling "operational" errors (e.g., user input errors).
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Mark as a trusted, operational error

        Error.captureStackTrace(this, this.constructor);
    }
}

// Handles sending detailed errors during development
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

// Handles sending generic, user-friendly errors in production
const sendErrorProd = (err, res) => {
    // For operational errors we trust, send the message to the client
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }

    // For programming or unknown errors, log them and send a generic message
    console.error('ERROR 💥:', err);
    res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
    });
};

export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        // In production, we can add more specific error handling here
        // for things like Mongoose validation or cast errors.
        sendErrorProd(err, res);
    }
};