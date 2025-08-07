import { useMutation, useQueryClient } from "@tanstack/react-query";
import { VerificationAPI } from "../service/verification/service";

import { useInfoViewStore } from "../store/core/infoView";
import type { ZCreateDocumentVerificationPayload } from "../service/verification/model";

export const QUERY_KEY = ["VERIFICATION_MANAGEMENT"];
export const QUERY_KEY_DETAIL = ["DETAIL_VERIFICATION_MANAGEMENT"];

const fetchDataVerification = async ({
  payload,
}: {
  payload: ZCreateDocumentVerificationPayload;
}): Promise<any> => {
  try {
    const data = await VerificationAPI.postVerification({
      payload: payload,
    });
    return data;
  } catch (error: any) {
    return error;
  }
};

export const useVerificationManagement = () => {
  const { showMessage, fetchError } = useInfoViewStore();
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    { payload: ZCreateDocumentVerificationPayload }
  >({
    mutationFn: fetchDataVerification,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      await showMessage("Verification created successfully");
    },
    onError: (error: any) => {
      console.error(error);
      fetchError(error.message);
    },
  });
};
