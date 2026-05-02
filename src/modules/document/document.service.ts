import { documentQueue } from '../../queues/document.queue';
import { createDocument } from './document.repository';
import { CreateDocumentDto } from './document.types';

export const uploadDocument = async (dto: CreateDocumentDto) => {
  const document = await createDocument(dto);

  await documentQueue.add('extract-document-data', {
    documentId: document.id,
  });

  return document;
};
