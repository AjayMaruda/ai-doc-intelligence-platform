import { DOCUMENT_STATUS } from '../../constants/document.constant';

export interface CreateDocumentDto {
  userId: number;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  status: DOCUMENT_STATUS;
}
