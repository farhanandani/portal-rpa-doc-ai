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
