import request from "../../lib/requestDocumentAi";

import { type ZCreateDocumentClassificationResponse } from "./model";

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
};
