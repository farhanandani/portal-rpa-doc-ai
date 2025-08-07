import React from "react";

import { Form, message } from "antd";
import { useSubmitFile } from "../../../../react-query/useFileManagement";

export default function useForm() {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const { mutateAsync: mutateAsyncAgent } = useSubmitFile();

  const onFinishFailed = (errorInfo: any) => {
    form.setFields(
      errorInfo.errorFields.map((field: any) => ({
        name: field.name,
        errors: field.errors,
      }))
    );

    console.log("errorInfo", errorInfo);
  };

  // Fungsi untuk mereset form termasuk file yang diupload
  const resetForm = () => {
    form.resetFields();
    setUploadedFile(null);
  };

  const onFinish = async (params: any) => {
    try {
      setIsLoading(true);

      // Validate that a file is uploaded
      if (!uploadedFile) {
        message.error("Please upload a file before submitting");
        setIsLoading(false);
        return;
      }

      // Create FormData object
      const formData = new FormData();

      // Add the uploaded file to FormData
      formData.append("files", uploadedFile);

      // Reset form dan file yang diupload
      resetForm();

      // Add other form data to FormData
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          formData.append(key, params[key]);
        }
      });

      const response = await mutateAsyncAgent({ payload: formData });
      setIsLoading(false);

      return response; // Return the response
    } catch (err) {
      setIsLoading(false);
      console.log("err", err);
      throw err; // Re-throw the error
    }
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    return false; // Prevent default upload behavior
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
  };

  return {
    form,
    onFinish,
    onFinishFailed,
    isLoading,
    uploadedFile,
    handleFileUpload,
    handleFileRemove,
    resetForm, // Export fungsi resetForm
  };
}
