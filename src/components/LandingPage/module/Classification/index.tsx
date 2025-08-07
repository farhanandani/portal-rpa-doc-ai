import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { Card, message, Upload, Form, Button } from "antd";
import useForm from "./useForm";
import { useState, useEffect } from "react";
import ModalAnalyze from "./ModalAnalyze";

const { Dragger } = Upload;

function Classification() {
  const {
    form,
    onFinish,
    onFinishFailed,
    isLoading,
    uploadedFile,
    handleFileUpload,
    handleFileRemove,
  } = useForm();
  const [responseData, setResponseData] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);

  // Effect untuk mereset form field ketika uploadedFile berubah menjadi null
  useEffect(() => {
    if (!uploadedFile) {
      form.setFieldValue("files", undefined);
    }
  }, [uploadedFile, form]);

  const handleFormSubmit = async (params: any) => {
    try {
      const response = await onFinish(params);
      setResponseData(response);
      message.success("File uploaded successfully!");
      setOpenModal(true);
      return response;
    } catch (error) {
      console.error("Error in Classification component:", error);
      message.error("Failed to upload file");
      throw error;
    }
  };

  const uploadProps: UploadProps = {
    name: "files",
    multiple: false,
    beforeUpload: (file) => {
      handleFileUpload(file);
      form.setFieldValue("files", file); // Set form field value
      message.success(`${file.name} file selected successfully.`);
      return false; // Prevent default upload behavior
    },
    onRemove: () => {
      handleFileRemove();
      form.setFieldValue("files", undefined);
      message.info("File removed");
    },
    fileList: uploadedFile
      ? [
          {
            uid: "-1",
            name: uploadedFile.name,
            status: "done",
            url: URL.createObjectURL(uploadedFile),
          },
        ]
      : [],
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-4">
        <Card className="w-full h-full">
          <Form
            form={form}
            onFinish={handleFormSubmit}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <div className="flex flex-col gap-4">
              <div>
                <Form.Item
                  name="files"
                  label="Upload File"
                  rules={[
                    {
                      required: true,
                      message: "Please upload a file!",
                      validator: () => {
                        if (!uploadedFile) {
                          return Promise.reject(
                            new Error("Please upload a file!")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single upload. Strictly prohibited from
                      uploading company data or other banned files.
                    </p>
                  </Dragger>
                </Form.Item>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  onClick={() => form.submit()}
                  loading={isLoading}
                  disabled={!uploadedFile}
                >
                  Submit Classification
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Card>
      </div>
      <ModalAnalyze
        responseData={responseData}
        open={openModal}
        close={() => setOpenModal(false)}
      />
    </>
  );
}

export default Classification;
