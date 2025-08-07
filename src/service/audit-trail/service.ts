import request from "../../lib/requestDocumentAi";

import { type ZGetDocumentExtractionResponse } from "./model";

export const AuditTrailAPI = {
  async getDocumentExtraction(): Promise<ZGetDocumentExtractionResponse> {
    try {
      const response =
        await request.get<ZGetDocumentExtractionResponse>(`/audit-trail`);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },
};
