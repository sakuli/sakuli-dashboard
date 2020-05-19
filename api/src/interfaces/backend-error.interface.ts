export interface BackendError {
    message: string
}

export function isBackendError(error: any): error is BackendError {
    return (error as BackendError).message !== undefined;
}