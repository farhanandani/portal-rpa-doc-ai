import {
  // useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ClassificationAPI } from "../service/classification/service";

import { useInfoViewStore } from "../store/core/infoView";

export const QUERY_KEY = ["CLASSIFICATION_MANAGEMENT"];
export const QUERY_KEY_DETAIL = ["DETAIL_CLASSIFICATION_MANAGEMENT"];

// -----

const fetchDataClassification = async ({
  payload,
}: {
  payload: any;
}): Promise<any> => {
  const data = await ClassificationAPI.postClassification({
    payload: payload,
  });
  return data;
};

export const useClassificationManagement = () => {
  const { showMessage, fetchError } = useInfoViewStore();
  const queryClient = useQueryClient();
  return useMutation<any, Error, { payload: any }>({
    mutationFn: fetchDataClassification,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      await showMessage("Classification created successfully");
    },
    onError: (error: any) => {
      console.error(error);
      fetchError(error.message);
    },
  });
};
