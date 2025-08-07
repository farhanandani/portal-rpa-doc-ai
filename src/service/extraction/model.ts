import * as z from "zod";

const CreateDocumentExtractionPayloadSchema = z.object({
  blobPath: z.string(),
  containerName: z.string(),
  modelId: z.string(),
  useAsTrainingData: z.boolean(),
});

export type ZCreateDocumentExtractionPayload = z.infer<
  typeof CreateDocumentExtractionPayloadSchema
>;

// Get Document List Model Extraction Response
const GetDocumentListModelExtractionResponseElementSchema = z.array(
  z.object({
    modelId: z.string(),
    createdDateTime: z.coerce.date(),
    modifiedDateTime: z.coerce.date(),
    expirationDateTime: z.coerce.date(),
    apiVersion: z.string(),
    description: z.string(),
  })
);

export type ZGetDocumentListModelExtractionResponse = z.infer<
  typeof GetDocumentListModelExtractionResponseElementSchema
>;
