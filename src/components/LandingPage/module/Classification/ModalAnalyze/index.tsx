import { Button, Modal, Select } from "antd";
import { useState, useEffect } from "react";
import {
  useClassificationManagement,
  useGetDocumentListModelClassification,
} from "../../../../../react-query/useClassificationManagement";

function ModalAnalyze({
  responseData,
  open,
  close,
}: {
  responseData: any;
  open: boolean;
  close: () => void;
}) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [localPdfUrl, setLocalPdfUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  const { mutateAsync: mutateAsyncClassification } =
    useClassificationManagement();

  const { data: documentListModelClassification } =
    useGetDocumentListModelClassification();
  console.log("responseData", documentListModelClassification);

  useEffect(() => {
    setPdfUrl(
      `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${responseData?.results[0]?.blobPath}`
    );
  }, [responseData]);

  // Auto download when modal opens
  useEffect(() => {
    if (open && pdfUrl && !localPdfUrl) {
      handleAutoDownload();
    }
  }, [open, pdfUrl]);

  // Cleanup when modal closes
  useEffect(() => {
    if (!open && localPdfUrl) {
      URL.revokeObjectURL(localPdfUrl);
      setLocalPdfUrl("");
    }
  }, [open, localPdfUrl]);

  const handleAutoDownload = async () => {
    if (!pdfUrl) return;

    setIsDownloading(true);
    try {
      // Fetch the PDF file
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const blob = await response.blob();

      // Create local URL for object element
      const url = URL.createObjectURL(blob);
      setLocalPdfUrl(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleClose = () => {
    if (localPdfUrl) {
      URL.revokeObjectURL(localPdfUrl);
      setLocalPdfUrl("");
    }
    close();
  };

  const handleProcessFile = async () => {
    setIsProcessing(true);
    const payload = {
      blobPath: responseData?.results[0]?.blobPath,
      containerName: "infomediadocairesult",
      modelId: selectedModelId,
      useAsTrainingData: false,
    };

    await mutateAsyncClassification({ payload });
    handleClose();
    setIsProcessing(false);
  };

  return (
    <>
      <Modal open={open} onCancel={handleClose} footer={null}>
        <div className="flex flex-col gap-4">
          <div>
            {isDownloading ? (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>Loading PDF...</p>
              </div>
            ) : localPdfUrl ? (
              <object data={localPdfUrl} width="100%" height="500px" />
            ) : (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>Failed to load PDF</p>
              </div>
            )}
          </div>
          <Select
            placeholder="Select Model"
            options={documentListModelClassification?.map((item: any) => ({
              label: item.classifierId,
              value: item.classifierId,
            }))}
            onChange={(value) => setSelectedModelId(value)}
          />
          <Button onClick={handleProcessFile} loading={isProcessing}>
            Process File
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ModalAnalyze;
