import { Response } from 'express';

/**
 * Interface for structured API response parameters.
 * @template T - The type of the data object being returned.
 */
interface SendResponseParams<T> {
  /** HTTP status code (e.g., 200, 201, 400). */
  statusCode: number;
  /** Indicates if the operation was successful. */
  success: boolean;
  /** Human-readable message describing the result. */
  message: string;
  /** Optional data payload. */
  data?: T;
}

/**
 * Standardizes API success responses across the application.
 *
 * @param res - Express Response object.
 * @param payload - Structured response data.
 */
export const sendResponse = <T>(
  res: Response,
  payload: SendResponseParams<T>,
): void => {
  const { statusCode, success, message, data } = payload;

  res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
  });
};
