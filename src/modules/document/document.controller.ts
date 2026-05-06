import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import {
  getDocumentById,
  uploadDocument as uploadDocumentService,
} from './document.service';
import { sendResponse } from '../../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { DOCUMENT_STATUS } from '../../constants/document.constant';
import { uploadFileToStorage } from '../../services/storage.service';

export const uploadDocument = catchAsync(
  async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: 'No file uploaded',
      });
    }

    const objectKey = await uploadFileToStorage(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    const result = await uploadDocumentService({
      userId: req.user!.id,
      fileName: file.originalname,
      fileUrl: objectKey,
      mimeType: file.mimetype,
      status: DOCUMENT_STATUS.PENDING,
    });

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Document uploaded successfully',
      data: result,
    });
  },
);

export const getStatus = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);

  if (isNaN(id)) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: 'Invalid document ID',
    });
  }

  const document = await getDocumentById(id, req.user!.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Document status fetched successfully',
    data: document,
  });
});
