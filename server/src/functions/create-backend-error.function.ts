import { BackendError } from "@sakuli-dashboard/api";

export default function createBackendError(errorMessage: string): BackendError {
    return {message: errorMessage}
}