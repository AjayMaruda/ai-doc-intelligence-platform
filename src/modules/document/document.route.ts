import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';
import {
  getDocumentAnalyticsController,
  getDocuments,
  getRecentInsightsController,
  getStatus,
  retryDocumentController,
  uploadDocument,
} from './document.controller';

const router = Router();
router.post(
  '/upload',
  /*  #swagger.tags = ['Documents']
      #swagger.summary = 'Upload a document for processing'
      #swagger.description = 'Authenticated users can upload PDF or image files for asynchronous AI extraction.'
      #swagger.security = [{ bearerAuth: [] }]

      #swagger.requestBody = {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                document: {
                  type: "string",
                  format: "binary",
                  description: "Document file to upload"
                }
              },
              required: ["document"]
            }
          }
        }
      }

      #swagger.responses[201] = {
        description: 'Document uploaded successfully'
      }
  */
  authenticate,
  upload.single('document'),
  uploadDocument,
);

router.get(
  '/:id/status',
  /*  #swagger.tags = ['Documents']
      #swagger.summary = 'Get document processing status'
      #swagger.security = [{ bearerAuth: [] }]
      #swagger.parameters['id'] = { 
          in: 'path',
          required: true,
          type: 'string',
          description: 'Document ID'
      }
      #swagger.responses[200] = { description: 'Document status fetched successfully' }
  */
  authenticate,
  getStatus,
);

router.get(
  '/',
  /*  #swagger.tags = ['Document']
      #swagger.summary = 'Get user documents'
      #swagger.security = [{ bearerAuth: [] }]
  */
  authenticate,
  getDocuments,
);

router.get(
  '/analytics',
  /*  #swagger.tags = ['Document']
      #swagger.summary = 'Get document analytics'
      #swagger.security = [{ bearerAuth: [] }]
  */
  authenticate,
  getDocumentAnalyticsController,
);

router.get(
  '/recent-insights',
  /*  #swagger.tags = ['Document']
      #swagger.summary = 'Get recent AI document insights'
      #swagger.security = [{ bearerAuth: [] }]
  */
  authenticate,
  getRecentInsightsController,
);

router.post(
  '/:id/retry',
  /*  #swagger.tags = ['Document']
      #swagger.summary = 'Retry failed document processing'
      #swagger.security = [{ bearerAuth: [] }]
  */
  authenticate,
  retryDocumentController,
);

export default router;
