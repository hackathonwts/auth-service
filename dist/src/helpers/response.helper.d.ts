export declare function successResponse(data: any, message?: string): {
    success: boolean;
    message: string;
    data: any;
};
export declare function errorResponse(message: string): {
    success: boolean;
    message: string;
    data: any;
};
export declare function validationResponse(error: any): {
    success: boolean;
    message: any;
    data: any;
};
