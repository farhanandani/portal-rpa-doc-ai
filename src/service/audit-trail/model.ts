import * as z from "zod";

export const DocumentSplithPathSchema = z.enum([
  "",
  "tssc/ticket-id-123/classifier/bast_classifier.pdf",
  "tssc/ticket-id-123/classifier/enofa_classifier.pdf",
]);
export type DocumentSplithPath = z.infer<typeof DocumentSplithPathSchema>;

export const TypeSchema = z.enum(["string"]);
export type Type = z.infer<typeof TypeSchema>;

export const ModuleSchema = z.enum(["classifier", "extractor", "verification"]);
export type Module = z.infer<typeof ModuleSchema>;

export const NamaPekerjaanSchema = z.object({
  type: TypeSchema.optional(),
  content: z.string().optional(),
  confidence: z.number().optional(),
  valueString: z.string().optional(),
});
export type NamaPekerjaan = z.infer<typeof NamaPekerjaanSchema>;

export const TerbilangSchema = z.object({
  type: TypeSchema.optional(),
  confidence: z.number().optional(),
});
export type Terbilang = z.infer<typeof TerbilangSchema>;

export const VerificationDatumSchema = z.object({
  documentType: z.string().optional(),
  documentValue: z.string().optional(),
});
export type VerificationDatum = z.infer<typeof VerificationDatumSchema>;

export const ExtractSchema = z.object({
  terbilang: TerbilangSchema.optional(),
  nama_vendor: NamaPekerjaanSchema.optional(),
  pihak_kedua: NamaPekerjaanSchema.optional(),
  nomor_dokumen: NamaPekerjaanSchema.optional(),
  nomor_kontrak: NamaPekerjaanSchema.optional(),
  pihak_pertama: NamaPekerjaanSchema.optional(),
  nama_pekerjaan: NamaPekerjaanSchema.optional(),
  tanggal_dokumen: NamaPekerjaanSchema.optional(),
  tanggal_kontrak: NamaPekerjaanSchema.optional(),
  nominal_pekerjaan: NamaPekerjaanSchema.optional(),
});
export type Extract = z.infer<typeof ExtractSchema>;

export const ExtractionValueSchema = z.object({
  docType: z.string().optional(),
  extractedData: ExtractSchema.optional(),
});
export type ExtractionValue = z.infer<typeof ExtractionValueSchema>;

export const VerificationResultElementSchema = z.object({
  confidence: z.number().optional(),
  verificationData: z.array(VerificationDatumSchema).optional(),
  verificationRule: z.string().optional(),
  verificationReason: z.string().optional(),
  verificationResult: z.string().optional(),
});
export type VerificationResultElement = z.infer<
  typeof VerificationResultElementSchema
>;

export const PurpleVerificationResultSchema = z.object({
  rules: z.array(z.string()).optional(),
  sessionId: z.string().optional(),
  extractionValue: z.array(ExtractionValueSchema).optional(),
  verificationResult: z.array(VerificationResultElementSchema).optional(),
});
export type PurpleVerificationResult = z.infer<
  typeof PurpleVerificationResultSchema
>;

export const GetAuditTrailResponseElementSchema = z.array(
  z.object({
    uuid: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    sessionId: z.string().optional(),
    module: ModuleSchema.optional(),
    documentBlobFilePath: z.string().optional(),
    documentSplithPath: DocumentSplithPathSchema.optional(),
    annotatedClassifierDocumentBlobFilePath: z.string().optional(),
    annotatedExtractorDocumentBlobFilePath: z.string().optional(),
    extractionResult: z.union([ExtractSchema, z.string()]).optional(),
    verificationResult: z
      .union([PurpleVerificationResultSchema, z.string()])
      .optional(),
    processedInSeconds: z.number().optional(),
  })
);
export type ZGetAuditTrailResponseElement = z.infer<
  typeof GetAuditTrailResponseElementSchema
>;
