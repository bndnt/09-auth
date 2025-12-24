import axios, { AxiosError } from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const serverApi = axios.create({
  baseURL,
  withCredentials: true,
});
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
