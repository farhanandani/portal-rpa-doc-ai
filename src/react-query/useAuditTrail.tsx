import { useQuery } from "@tanstack/react-query";
import { AuditTrailAPI } from "../service/audit-trail/service";
import { type ZGetDocumentExtractionResponse } from "../service/audit-trail/model";

export const QUERY_KEY = ["AUDIT_TRAIL_MANAGEMENT"];
export const QUERY_KEY_DETAIL = ["DETAIL_AUDIT_TRAIL_MANAGEMENT"];

// -----

const fetchDataClassification =
  async (): Promise<ZGetDocumentExtractionResponse> => {
    const data = await AuditTrailAPI.getDocumentExtraction();
    return data;
  };

export const useGetAuditTrail = () => {
  return useQuery<ZGetDocumentExtractionResponse, Error>({
    queryKey: QUERY_KEY,
    queryFn: fetchDataClassification,
  });
};
