import request from "../../lib/requestDocumentAi";

import type {
  ZCreateDocumentClassificationResponse,
  ZGetDocumentListModelClassificationResponse,
} from "./model";

export const ClassificationAPI = {
  async postClassification({
    payload,
  }: {
    payload: ZCreateDocumentClassificationResponse;
  }): Promise<any> {
    try {
      const response = await request.post<any>("/classifier/analyze", payload);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async getDocumentListModelClassification(): Promise<ZGetDocumentListModelClassificationResponse> {
    try {
      const response =
        await request.get<ZGetDocumentListModelClassificationResponse>(
          "/classifier/models"
        );
      return response.data;
    } catch (error: any) {
      return error;
    }
  },
};
