import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import {
  getDocumentById,
  uploadDocument as uploadDocumentService,
} from './document.service';
import { sendResponse } from '../../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { DOCUMENT_STATUS } from '../../constants/document.constant';

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

    const result = await uploadDocumentService({
      userId: req.user!.id,
      fileName: file.originalname,
      fileUrl: file.path,
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
  const result = await getDocumentById(Number(req.params.id), req.user!.id);
  sendResponse(res, {
    success: true,
    message: 'Document status fetched successfully',
    statusCode: StatusCodes.OK,
    data: result,
  });
});
