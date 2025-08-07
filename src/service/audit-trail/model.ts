import * as z from "zod";

const TypeSchema = z.enum(["string"]);

const ModuleSchema = z.enum(["classifier", "extractor"]);

const BoundingRegionSchema = z.object({
  polygon: z.array(z.number()),
  pageNumber: z.number(),
});

const SpanSchema = z.object({
  length: z.number(),
  offset: z.number(),
});

const TerbilangSchema = z.object({
  type: TypeSchema,
  confidence: z.number(),
});

const NamaPekerjaanSchema = z.object({
  type: TypeSchema,
  confidence: z.number(),
  content: z.string().optional(),
  valueString: z.string().optional(),
  spans: z.array(SpanSchema).optional(),
  boundingRegions: z.array(BoundingRegionSchema).optional(),
});

const ExtractionResultClassSchema = z.object({
  terbilang: TerbilangSchema,
  nama_vendor: NamaPekerjaanSchema,
  pihak_kedua: NamaPekerjaanSchema,
  nomor_dokumen: NamaPekerjaanSchema,
  nomor_kontrak: NamaPekerjaanSchema,
  pihak_pertama: NamaPekerjaanSchema,
  nama_pekerjaan: NamaPekerjaanSchema,
  tanggal_dokumen: NamaPekerjaanSchema,
  tanggal_kontrak: NamaPekerjaanSchema,
  nominal_pekerjaan: NamaPekerjaanSchema,
});

const GetDocumentExtractionResponseElementSchema = z.object({
  uuid: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  sessionId: z.string(),
  module: ModuleSchema,
  documentBlobFilePath: z.string(),
  documentSplithPath: z.string(),
  annotatedClassifierDocumentBlobFilePath: z.string(),
  annotatedExtractorDocumentBlobFilePath: z.string(),
  extractionResult: z.union([
    ExtractionResultClassSchema,
    z.null(),
    z.string(),
  ]),
  processedInSeconds: z.number(),
});

export type ZGetDocumentExtractionResponse = z.infer<
  typeof GetDocumentExtractionResponseElementSchema
>[];

export type ZGetDocumentExtractionResponseElement = z.infer<
  typeof GetDocumentExtractionResponseElementSchema
>;
