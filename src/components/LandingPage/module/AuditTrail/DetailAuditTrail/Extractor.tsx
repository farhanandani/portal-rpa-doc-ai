import { useState, useEffect } from "react";
import { Card, Tag, Progress, Button } from "antd";
import { useDetailAudit } from "../store/useDetailAudit";
import { useNavigate } from "react-router-dom";

interface AuditTrailData {
  uuid: string;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
  module: string;
  documentBlobFilePath: string;
  documentSplithPath: string;
  annotatedClassifierDocumentBlobFilePath: string;
  annotatedExtractorDocumentBlobFilePath: string;
  extractionResult: any;
  verificationResult?: any;
  processedInSeconds: number;
}

function Extractor() {
  const navigate = useNavigate();
  const { selectedData } = useDetailAudit();
  const [extractorPdfUrl, setExtractorPdfUrl] = useState<string>("");
  const [localExtractorPdfUrl, setLocalExtractorPdfUrl] = useState<string>("");
  const [auditData, setAuditData] = useState<AuditTrailData | null>(null);
  const [isDownloadingExtractor, setIsDownloadingExtractor] = useState(false);
  const [verificationPdfUrl, setVerificationPdfUrl] = useState<string>("");
  const [localVerificationPdfUrl, setLocalVerificationPdfUrl] =
    useState<string>("");
  const [isDownloadingVerification, setIsDownloadingVerification] =
    useState(false);

  // Mencari data berdasarkan UUID
  useEffect(() => {
    const data = selectedData;
    if (data) {
      setAuditData(data);
      if (data.annotatedExtractorDocumentBlobFilePath) {
        const extractorUrl = `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${data.annotatedExtractorDocumentBlobFilePath}`;
        setExtractorPdfUrl(extractorUrl);
      }
    }
  }, [selectedData]);

  // Auto download extractor PDF ketika URL tersedia
  useEffect(() => {
    if (extractorPdfUrl && !localExtractorPdfUrl) {
      handleExtractorDownload();
    }
  }, [extractorPdfUrl]);

  const handleExtractorDownload = async () => {
    if (!extractorPdfUrl) return;

    setIsDownloadingExtractor(true);
    try {
      const response = await fetch(extractorPdfUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to download extractor file from ${extractorPdfUrl}`
        );
      }

      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setLocalExtractorPdfUrl(localUrl);
    } catch (error) {
      console.error("Extractor download failed:", error);
    } finally {
      setIsDownloadingExtractor(false);
    }
  };

  const renderExtractionResult = () => {
    if (!auditData?.extractionResult) {
      return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>No Extractor PDF available</p>
        </div>
      );
    }

    const result = auditData.extractionResult;
    const items = Object.entries(result).map(([key, value]: [string, any]) => {
      const confidence = value.confidence || 0;
      const confidencePercentage = Math.round(confidence * 100);

      return (
        <Card
          key={key}
          size="small"
          className="mb-3"
          title={
            <div className="flex items-center justify-between">
              <span className="font-medium capitalize">
                {key.replace(/_/g, " ")}
              </span>
              <Tag
                color={
                  confidencePercentage > 80
                    ? "green"
                    : confidencePercentage > 60
                      ? "orange"
                      : "red"
                }
              >
                {confidencePercentage}%
              </Tag>
            </div>
          }
        >
          <div className="space-y-2">
            <Progress
              percent={confidencePercentage}
              size="small"
              status={
                confidencePercentage > 80
                  ? "success"
                  : confidencePercentage > 60
                    ? "normal"
                    : "exception"
              }
            />
            {value.content && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Content:</p>
                <p className="text-sm bg-gray-50 p-2 rounded">
                  {value.content}
                </p>
              </div>
            )}
            {value.valueString && value.valueString !== value.content && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Value:</p>
                <p className="text-sm bg-blue-50 p-2 rounded">
                  {value.valueString}
                </p>
              </div>
            )}
            <div className="text-xs text-gray-500">Type: {value.type}</div>
          </div>
        </Card>
      );
    });

    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-lg font-semibold">Extraction Results</h3>
          <Tag color="blue">{Object.keys(result).length} fields extracted</Tag>
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">{items}</div>
      </div>
    );
  };

  // PDF Preview
  useEffect(() => {
    if (selectedData) {
      if (selectedData.documentBlobFilePath) {
        const verificationUrl = `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${selectedData.documentBlobFilePath}`;
        setVerificationPdfUrl(verificationUrl);
      } else {
        console.log("No documentBlobFilePath found or it's empty");
      }
    }
  }, [selectedData]);

  useEffect(() => {
    if (verificationPdfUrl && !localVerificationPdfUrl) {
      handleVerificationDownload();
    }
  }, [verificationPdfUrl]);

  const handleVerificationDownload = async () => {
    if (!verificationPdfUrl) {
      return;
    }

    setIsDownloadingVerification(true);
    try {
      const response = await fetch(verificationPdfUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to download verification file from ${verificationPdfUrl}`
        );
      }

      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setLocalVerificationPdfUrl(localUrl);
    } catch (error) {
      console.error("Verification download failed:", error);
    } finally {
      setIsDownloadingVerification(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="h-full overflow-auto p-4 flex gap-4">
        <div className="w-1/2 h-full border rounded-lg p-4 flex flex-col">
          {renderExtractionResult()}
        </div>
        <div className="w-1/2 h-full flex flex-col gap-4">
          <div className="flex-1 border rounded-lg p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
              Extractor PDF
            </h3>
            {isDownloadingExtractor ? (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>Loading Extractor PDF...</p>
              </div>
            ) : localExtractorPdfUrl ? (
              <>
                <div className="flex-1 min-h-0">
                  <iframe
                    src={`${localExtractorPdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                    width="100%"
                    height="100%"
                    style={{ border: "1px solid #d9d9d9", borderRadius: "4px" }}
                    title="Extractor PDF"
                  />
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>No Extractor PDF available</p>
              </div>
            )}
          </div>
          <div className="flex-1 border rounded-lg p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
              PDF Viewer
            </h3>
            {(() => {
              if (isDownloadingVerification) {
                return (
                  <div className="flex-1 flex items-center justify-center">
                    <p>Loading Verification PDF...</p>
                  </div>
                );
              } else if (localVerificationPdfUrl) {
                return (
                  <iframe
                    src={`${localVerificationPdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                    width="100%"
                    height="100%"
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "4px",
                    }}
                    title="Verification PDF"
                  />
                );
              } else {
                return (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <p>No Verification PDF available</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Debug: verificationPdfUrl=
                      {verificationPdfUrl ? "Set" : "Not set"}
                    </p>
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </div>
      <Button
        type="primary"
        onClick={() => navigate("/landing-page/audit-trail")}
      >
        Done
      </Button>
    </div>
  );
}

export default Extractor;
