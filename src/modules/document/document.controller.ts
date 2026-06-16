import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import {
  getDocumentAnalyticsService,
  getDocumentById,
  getRecentDocumentInsights,
  getUserDocuments,
  retryFailedDocument,
  uploadDocument as uploadDocumentService,
} from './document.service';
import { sendResponse } from '../../utils/apiResponse';
import { StatusCodes } from 'http-status-codes';
import { DOCUMENT_STATUS } from '../../constants/document.constant';
import { uploadFileToStorage } from '../../services/storage.service';
import { deleteDocument } from './document.repository';

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
      objectKey: objectKey,
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

export const getDocuments = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);

  const result = await getUserDocuments(req.user!.id, page, limit);

  sendResponse(res, {
    success: true,
    message: `Document fetched successfully.`,
    statusCode: StatusCodes.OK,
    data: result,
  });
});

export const getDocumentAnalyticsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getDocumentAnalyticsService(req.user!.id);

    sendResponse(res, {
      success: true,
      message: 'Document analytics fetched successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  },
);

export const getRecentInsightsController = catchAsync(
  async (req: Request, res: Response) => {
    const limit = Number(req.query.limit || 5);

    const result = await getRecentDocumentInsights(req.user!.id, limit);

    sendResponse(res, {
      success: true,
      message: 'Recent insights fetched successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  },
);

export const retryDocumentController = catchAsync(
  async (req: Request, res: Response) => {
    const documentId = Number(req.params.id);

    const result = await retryFailedDocument(documentId, req.user!.id);

    sendResponse(res, {
      success: true,
      message: 'Document retry initiated successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  },
);

export const deleteDocumentController = catchAsync(
  async (req: Request, res: Response) => {
    const documentId = Number(req.params.id);

    const result = await deleteDocument(documentId, req.user!.id);

    sendResponse(res, {
      success: true,
      message: 'Document deleted successfully',
      statusCode: StatusCodes.OK,
      data: result,
    });
  },
);
