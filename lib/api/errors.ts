import { AxiosError } from "axios";

export function getApiErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";

  const err = error as ApiError;

  return (
    err.response?.data?.response?.validation?.body?.message ??
    err.response?.data?.response?.message ??
    err.response?.data?.error ??
    err.message ??
    "Something went wrong"
  );
}
export type ApiErrorResponse = {
  error?: string;
  response?: {
    message?: string;
    validation?: {
      body?: {
        message?: string;
      };
    };
  };
};

export type ApiError = AxiosError<ApiErrorResponse>;
