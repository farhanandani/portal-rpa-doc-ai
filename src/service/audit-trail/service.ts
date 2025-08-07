import request from "../../lib/requestDocumentAi";

import { type ZGetAuditTrailResponseElement } from "./model";

export const AuditTrailAPI = {
  async getDocumentExtraction(): Promise<ZGetAuditTrailResponseElement> {
    try {
      const response =
        await request.get<ZGetAuditTrailResponseElement>(`/audit-trail`);
      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  async getDetailVerification({
    sessionId,
  }: {
    sessionId: string;
  }): Promise<any> {
    const response = await request.get(`/audit-trail/${sessionId}`);
    return response.data;
  },
};
