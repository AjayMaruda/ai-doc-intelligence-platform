import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { uploadDocument as uploadDocumentService } from './document.service';
import { sendResponse } from '../../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';

export const uploadDocument = catchAsync(
  async (req: Request, res: Response) => {
    const file = req.file;

    const result = await uploadDocumentService({
      userId: req.user?.id as number,
      fileName: file!.originalname,
      fileUrl: file!.path,
      mimeType: file!.mimetype,
    });

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Document uploaded successfully',
      data: result,
    });
  },
);
