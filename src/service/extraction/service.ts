import request from "../../lib/requestDocumentAi";

import { type ZCreateDocumentExtractionPayload } from "./model";

export const ExtractionAPI = {
  async postExtraction({
    payload,
  }: {
    payload: ZCreateDocumentExtractionPayload;
  }): Promise<any> {
    try {
      const response = await request.post<any>("/extraction/analyze", payload);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },
};
