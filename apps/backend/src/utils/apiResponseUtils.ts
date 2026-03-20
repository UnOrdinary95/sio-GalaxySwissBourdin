import { ApiError, ApiSuccess } from '@gsb/types';

export function makeSuccess<T>(data?: T, message?: string): ApiSuccess<T> {
    return {
        success: true,
        data,
        message,
    };
}

export function makeError(error: string): ApiError {
    return {
        success: false,
        error,
    };
}
