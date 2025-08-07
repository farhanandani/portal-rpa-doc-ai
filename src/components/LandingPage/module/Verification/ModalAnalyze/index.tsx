import { Button, Input, Modal, Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useGetDocumentListModelClassification } from "../../../../../react-query/useClassificationManagement";

import { useVerificationManagement } from "../../../../../react-query/useVerificationManagement";

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
  const [rules, setRules] = useState<string[]>([]);
  const [ruleInputs, setRuleInputs] = useState<string[]>([]);

  const { mutateAsync: mutateAsyncVerification } = useVerificationManagement();

  const { data: documentListModelClassification } =
    useGetDocumentListModelClassification();

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

  const handleAddRule = () => {
    setRuleInputs([...ruleInputs, ""]);
  };

  const handleRemoveRule = (index: number) => {
    const newRuleInputs = ruleInputs.filter((_, i) => i !== index);
    setRuleInputs(newRuleInputs);

    // Update rules array accordingly
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const handleRuleInputChange = (index: number, value: string) => {
    const newRuleInputs = [...ruleInputs];
    newRuleInputs[index] = value;
    setRuleInputs(newRuleInputs);

    // Update rules array
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  const handleProcessFile = async () => {
    setIsProcessing(true);
    const payload = {
      blobPath: responseData?.results[0]?.blobPath,
      containerName: "infomediadocairesult",
      classifierModelId: selectedModelId,
      rules: rules.filter((rule) => rule.trim() !== ""),
    };

    await mutateAsyncVerification({ payload });
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
              label: item.description,
              value: item.classifierId,
            }))}
            onChange={(value) => setSelectedModelId(value)}
          />

          {/* Rules Section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Rules</h4>
              <Button type="dashed" size="small" onClick={handleAddRule}>
                Add Rule
              </Button>
            </div>

            {ruleInputs.map((rule, index) => (
              // <Space key={index} style={{ width: "100%" }}>
              <div className="flex items-center gap-2">
                <Input
                  placeholder={`Enter rule ${index + 1}`}
                  value={rule}
                  onChange={(e) => handleRuleInputChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveRule(index)}
                  size="small"
                />
              </div>
              // </Space>
            ))}
          </div>

          <Button onClick={handleProcessFile} loading={isProcessing}>
            Process File
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ModalAnalyze;
