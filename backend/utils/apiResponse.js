/**
 * Standard API Response Utility
 */
class ApiResponse {
    /**
     * Success Response
     * @param {Object} res - Express response object
     * @param {String} message - Success message
     * @param {Object} data - Data to return
     * @param {Number} statusCode - HTTP status code (Default: 200)
     */
    static success(res, message = "Success", data = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            status: statusCode,
            message,
            data
        });
    }

    /**
     * Error Response
     * @param {Object} res - Express response object
     * @param {String} error - Error message
     * @param {Number} statusCode - HTTP status code (Default: 500)
     * @param {Object} details - Additional error details
     */
    static error(res, error = "Internal Server Error", statusCode = 500, details = null) {
        return res.status(statusCode).json({
            success: false,
            status: statusCode,
            error,
            details
        });
    }
}

module.exports = ApiResponse;
