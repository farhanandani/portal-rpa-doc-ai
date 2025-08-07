import request from "../../lib/requestDocumentAi";
import type { ZCreateDocumentVerificationPayload } from "./model";

export const VerificationAPI = {
  async postVerification({
    payload,
  }: {
    payload: ZCreateDocumentVerificationPayload;
  }): Promise<any> {
    try {
      const response = await request.post<any>(
        "/verification/analyze",
        payload
      );
      return response.data;
    } catch (error: any) {
      return error;
    }
  },
};
