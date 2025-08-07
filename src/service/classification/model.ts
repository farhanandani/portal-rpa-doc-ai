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

// Get Document List Model Classification Response
const AzureBlobFileListSourceSchema = z.object({
  containerUrl: z.string(),
  fileList: z.string(),
});

const BastSchema = z.object({
  kind: z.string(),
  azureBlobFileListSource: AzureBlobFileListSourceSchema,
});

const DocTypesSchema = z.object({
  bast: BastSchema.optional(),
  faktur_pajak: BastSchema.optional(),
  kuitansi: BastSchema.optional(),
  tagihan_invoice: BastSchema.optional(),
  surat_pesanan: BastSchema.optional(),
  enofa: BastSchema.optional(),
  npwp: BastSchema.optional(),
});

const GetDocumentListModelClassificationResponseElementSchema = z.array(
  z.object({
    classifierId: z.string(),
    createdDateTime: z.coerce.date(),
    modifiedDateTime: z.coerce.date(),
    expirationDateTime: z.coerce.date(),
    apiVersion: z.string(),
    docTypes: DocTypesSchema,
    description: z.string(),
  })
);

export type ZGetDocumentListModelClassificationResponse = z.infer<
  typeof GetDocumentListModelClassificationResponseElementSchema
>;
