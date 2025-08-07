import {
  // useQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ExtractionAPI } from "../service/extraction/service";

import { useInfoViewStore } from "../store/core/infoView";
import type { ZGetDocumentListModelExtractionResponse } from "../service/extraction/model";

export const QUERY_KEY = ["EXTRACTION_MANAGEMENT"];
export const QUERY_KEY_DETAIL = ["DETAIL_EXTRACTION_MANAGEMENT"];

// -----

const fetchDataClassification = async ({
  payload,
}: {
  payload: any;
}): Promise<any> => {
  const data = await ExtractionAPI.postExtraction({
    payload: payload,
  });
  return data;
};

export const useExtractionManagement = () => {
  const { showMessage, fetchError } = useInfoViewStore();
  const queryClient = useQueryClient();
  return useMutation<any, Error, { payload: any }>({
    mutationFn: fetchDataClassification,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      await showMessage("Extraction created successfully");
    },
    onError: (error: any) => {
      console.error(error);
      fetchError(error.message);
    },
  });
};

// -----

const fetchDataGetDocumentListModelExtraction =
  async (): Promise<ZGetDocumentListModelExtractionResponse> => {
    try {
      const data = await ExtractionAPI.getDocumentListModelExtraction();
      return data;
    } catch (error: any) {
      return error;
    }
  };

export const useGetDocumentListModelExtraction = () => {
  return useQuery({
    queryKey: QUERY_KEY_DETAIL,
    queryFn: fetchDataGetDocumentListModelExtraction,
  });
};
