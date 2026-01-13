"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
exports.validationResponse = validationResponse;
function successResponse(data, message = 'Operation successful') {
    return {
        success: true,
        message,
        data,
    };
}
function errorResponse(message) {
    return {
        success: false,
        message,
        data: null,
    };
}
function validationResponse(error) {
    return {
        success: false,
        message: error,
        data: null,
    };
}
