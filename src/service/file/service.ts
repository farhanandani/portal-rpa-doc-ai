import request from "../../lib/requestDocumentAi";
// import { ZSubmitFileGcsRequest, ZSubmitFileGcsResponse } from "./model";

export const FileAPI = {
  async postFile({
    payload,
  }: {
    payload: any;
  }): Promise<any> {
    try {
      let requestPayload: FormData;

      if (payload instanceof FormData) {
        requestPayload = payload;
      } else {
        requestPayload = payload.formData;
      }

      const response = await request.post<any>(
        `/azure-storage/upload/files/infomediadocairesult/tssc/ticket-id-123`,
        requestPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return error;
    }
  },

  // async getAllFiles({
  //   tenantId,
  //   folderPath,
  // }: // page,
  // // limit,
  // {
  //   tenantId: string;
  //   folderPath: string;
  //   // page: number;
  //   // limit: number;
  // }): Promise<typeof GetAllFilesSchema> {
  //   try {
  //     const response = await request.get<typeof GetAllFilesSchema>(
  //       `/files-gcs/${tenantId}/download/files/${folderPath}`
  //       // {
  //       //   params: {
  //       //     page,
  //       //     limit,
  //       //   },
  //       // },
  //     );

  //     return response.data;
  //   } catch (error: any) {
  //     return error;
  //   }
  // },

  // async getDetailFileByToken({
  //   tenantId,
  //   fileToken,
  // }: {
  //   tenantId: string;
  //   fileToken: string;
  // }): Promise<typeof GetFileDetailResponse> {
  //   try {
  //     const response = await request.get<typeof GetFileDetailResponse>(
  //       `/files-gcs/${tenantId}/download/file/${fileToken}`
  //     );

  //     return response.data;
  //   } catch (error: any) {
  //     return error;
  //   }
  // },

  // async getDetailFileByFolderPath({
  //   tenantId,
  //   folderPath,
  // }: {
  //   tenantId: string;
  //   folderPath: string;
  // }): Promise<typeof GetFileDetailResponse> {
  //   try {
  //     const response = await request.get<typeof GetFileDetailResponse>(
  //       `/files-gcs/${tenantId}/download/files/${folderPath}`
  //     );

  //     return response.data;
  //   } catch (error: any) {
  //     return error;
  //   }
  // },

  // async deleteFileByToken({
  //   tenantId,
  //   fileToken,
  // }: {
  //   tenantId: string;
  //   fileToken: string;
  // }): Promise<typeof DeleteFileResponseSchema> {
  //   try {
  //     const response = await request.delete<typeof DeleteFileResponseSchema>(
  //       `files-gcs/${tenantId}/delete/file/${fileToken}`
  //     );

  //     return response.data;
  //   } catch (error: any) {
  //     return error;
  //   }
  // },

  // async deleteFileByFolderPath({
  //   tenantId,
  //   folderPath,
  // }: {
  //   tenantId: string;
  //   folderPath: string;
  // }): Promise<typeof DeleteFileResponseSchema> {
  //   try {
  //     const response = await request.delete<typeof DeleteFileResponseSchema>(
  //       `files-gcs/${tenantId}/delete/file/name/${folderPath}`
  //     );

  //     return response.data;
  //   } catch (error: any) {
  //       return error;
  //   }
  // },
};
