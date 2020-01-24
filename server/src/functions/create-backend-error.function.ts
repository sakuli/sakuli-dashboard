import { BackendError } from "../api/backend-error.interface";

export default function createBackendError(errorMessage: string): BackendError {
    return {message: errorMessage}
}