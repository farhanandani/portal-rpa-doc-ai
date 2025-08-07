import * as z from "zod";

// Create Document Classification Payload
const CreateDocumentClassificationPayloadSchema = z.object({
  blobPath: z.string(),
  containerName: z.string(),
  modelId: z.string(),
  useAsTrainingData: z.boolean(),
});
export type CreateDocumentClassificationPayload = z.infer<
  typeof CreateDocumentClassificationPayloadSchema
>;

// Create Document Classification Response
const BoundingRegionSchema = z.object({
  pageNumber: z.number(),
  polygon: z.array(z.number()),
});

const DocumentTypeSchema = z.object({
  docType: z.string(),
  confidence: z.number(),
  regions: z.number(),
});

const UploadResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  etag: z.string(),
  lastModified: z.coerce.date(),
  requestId: z.string(),
  fileSize: z.number(),
});

const SplitPdfResultSchema = z.object({
  docType: z.string(),
  pageNumbers: z.array(z.number()),
  confidence: z.number(),
  savedPath: z.string(),
  uploadResult: UploadResultSchema,
});

const DocumentSchema = z.object({
  docType: z.string(),
  boundingRegions: z.array(BoundingRegionSchema),
  confidence: z.number(),
  spans: z.array(z.any()),
});

const DrawBoundingBoxAnnotationsResultSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  savedPath: z.string(),
  uploadResult: UploadResultSchema,
  documentTypes: z.array(DocumentTypeSchema),
});

const AnalyzeResultSchema = z.object({
  documents: z.array(DocumentSchema),
  splitPdfResult: z.array(SplitPdfResultSchema),
  drawBoundingBoxAnnotationsResult: DrawBoundingBoxAnnotationsResultSchema,
});

const CreateDocumentClassificationResponseSchema = z.object({
  analyzeResult: AnalyzeResultSchema,
});

export type ZCreateDocumentClassificationResponse = z.infer<
  typeof CreateDocumentClassificationResponseSchema
>;
