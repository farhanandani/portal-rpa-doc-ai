import {
  // useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { FileAPI } from "../service/file/service";
// import {
//   ZSubmitFileGcsResponse,
//   ZCreateFilePayload,
// } from "../service/classification/model";

import { useInfoViewStore } from "../store/core/infoView";

export const QUERY_KEY = ["FILE_MANAGEMENT"];
export const QUERY_KEY_DETAIL = ["DETAIL_FILE_MANAGEMENT"];

// -----

const fetchDataFile = async ({ payload }: { payload: any }): Promise<any> => {
  const data = await FileAPI.postFile({
    payload: payload,
  });
  return data;
};

export const useSubmitFile = () => {
  const { showMessage, fetchError } = useInfoViewStore();
  const queryClient = useQueryClient();
  return useMutation<
    any,
    Error,
    {
      payload: any;
    }
  >({
    mutationFn: fetchDataFile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      await showMessage("File created successfully");
    },
    onError: (error: any) => {
      console.error(error);
      fetchError(error.message);
    },
  });
};

// export const fetchGetDetailFile = async ({
//   tenantId,
//   fileToken,
// }: {
//   tenantId: string;
//   fileToken: string;
// }): Promise<ZGetFileDetailResponse> => {
//   try {
//     const data = await FileGCSAPI.getDetailFileByToken({
//       fileToken: fileToken,
//       tenantId: tenantId,
//     });

//     // Use Zod to validate the response data
//     const parsedData = GetFileDetailResponse.parse(data); // This throws an error if validation fails

//     return parsedData;
//   } catch (error) {
//     // Handle the error
//     console.error("Error parsing data:", error);
//     throw error; // Re-throw the error to propagate it to the caller
//   }
// };

// export const useGetDetailFile = (tenantId: string, fileToken: string) => {
//   return useQuery<any, Error>({
//     queryKey: [...QUERY_KEY_DETAIL],
//     queryFn: () => fetchGetDetailFile({ tenantId, fileToken }),
//     enabled: !!tenantId, // Only run when `uuid` is valid
//     // cacheTime: 0, // Prevent saving data in the cache
//     staleTime: 0, // Always treat the data as stale
//   });
// };

// -----

// const fetchGetAllFiles = async ({
//   tenantId,
//   folderPath,
// }: // page,
// // limit,
// {
//   tenantId: string;
//   folderPath: string;
//   // page: number;
//   // limit: number;
// }): Promise<typeof GetAllFilesSchema> => {
//   const data = await FileGCSAPI.getAllFiles({
//     tenantId,
//     folderPath,
//     // page,
//     // limit,
//   });
//   return data;
// };

// export const useGetAllFiles = (
//   tenantId: string,
//   folderPath: string
//   // page: number,
//   // limit: number,
// ) => {
//   return useQuery<any, Error>({
//     queryKey: [...QUERY_KEY],
//     queryFn: () => fetchGetAllFiles({ tenantId, folderPath }),
//   });
// };
