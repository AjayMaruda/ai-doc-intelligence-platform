import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload.middleware';
import { uploadDocument } from './document.controller';

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
  upload.single('document'),
  uploadDocument,
);

export default router;
