// src/helpers/ResponseHelper.ts
export function successResponse(data: any, message: string = 'Operation successful') {
  return {
    success: true,
    message,
    data,
  };
}

export function errorResponse(message: string) {
  return {
    success: false,
    message,
    data: null,
  };
}

export function validationResponse(error: any) {
  return {
    success: false,
    message: error,
    data: null,
  };
}