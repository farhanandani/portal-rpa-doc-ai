import request from "../../lib/requestDocumentAi";

import type {
  ZCreateDocumentExtractionPayload,
  ZGetDocumentListModelExtractionResponse,
} from "./model";

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

  async getDocumentListModelExtraction(): Promise<ZGetDocumentListModelExtractionResponse> {
    try {
      const response =
        await request.get<ZGetDocumentListModelExtractionResponse>(
          "/extraction/models"
        );
      return response.data;
    } catch (error: any) {
      return error;
    }
  },
};
