import multer from 'multer';
import { ApiError } from '../utils/apiError';
import { StatusCodes } from 'http-status-codes';

const storage = multer.memoryStorage();

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const allowMimeTypes = ['application/pdf'];

  if (!allowMimeTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(StatusCodes.BAD_REQUEST, 'Only PDF files are allowed', [
        { field: '' },
      ]),
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
