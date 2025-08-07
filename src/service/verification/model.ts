import * as z from "zod";

const CreateDocumentVerificationPayloadSchema = z.object({
  blobPath: z.string(),
  containerName: z.string(),
  classifierModelId: z.string(),
  rules: z.array(z.string()),
});

export type ZCreateDocumentVerificationPayload = z.infer<
  typeof CreateDocumentVerificationPayloadSchema
>;
