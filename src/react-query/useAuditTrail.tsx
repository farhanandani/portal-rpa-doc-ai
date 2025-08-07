import { useQuery } from "@tanstack/react-query";
import { AuditTrailAPI } from "../service/audit-trail/service";
import { type ZGetAuditTrailResponseElement } from "../service/audit-trail/model";

export const QUERY_KEY = ["AUDIT_TRAIL_MANAGEMENT"];
export const QUERY_KEY_DETAIL = ["DETAIL_AUDIT_TRAIL_MANAGEMENT"];

// -----

const fetchDataClassification =
  async (): Promise<ZGetAuditTrailResponseElement> => {
    const data = await AuditTrailAPI.getDocumentExtraction();
    return data;
  };

export const useGetAuditTrail = () => {
  return useQuery<ZGetAuditTrailResponseElement, Error>({
    queryKey: QUERY_KEY,
    queryFn: fetchDataClassification,
  });
};

// -----

const fetchDataDetailVerification = async ({
  sessionId,
}: {
  sessionId: string;
}): Promise<any> => {
  const data = await AuditTrailAPI.getDetailVerification({ sessionId });
  return data;
};

export const useGetDetailVerification = ({
  sessionId,
}: {
  sessionId: string;
}) => {
  return useQuery<any, Error>({
    queryKey: QUERY_KEY_DETAIL,
    queryFn: () => fetchDataDetailVerification({ sessionId }),
    enabled: !!sessionId,
  });
};
