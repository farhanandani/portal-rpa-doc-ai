import { useState, useEffect } from "react";
import { Button, message, Steps, theme, Card, Tag, Progress } from "antd";
import { useDetailAudit } from "../store/useDetailAudit";

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
  processedInSeconds: number;
}

function DetailAuditTrail() {
  const { selectedData } = useDetailAudit();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [localPdfUrls, setLocalPdfUrls] = useState<string[]>([]);
  const [extractorPdfUrl, setExtractorPdfUrl] = useState<string>("");
  const [localExtractorPdfUrl, setLocalExtractorPdfUrl] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingExtractor, setIsDownloadingExtractor] = useState(false);
  const [auditData, setAuditData] = useState<AuditTrailData | null>(null);

  // Mencari data berdasarkan UUID
  useEffect(() => {
    const data = selectedData;
    if (data) {
      setAuditData(data);
      const paths = data.documentSplithPath
        .split(",")
        .map((path: string) => path.trim())
        .filter((path: string) => path);
      const urls = paths.map(
        (path: string) =>
          `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${path}`
      );
      setPdfUrls(urls);

      if (data.annotatedExtractorDocumentBlobFilePath) {
        const extractorUrl = `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${data.annotatedExtractorDocumentBlobFilePath}`;
        setExtractorPdfUrl(extractorUrl);
      }
    }
  }, [selectedData]);

  // Auto download ketika component mount
  useEffect(() => {
    if (pdfUrls.length > 0 && localPdfUrls.length === 0) {
      handleAutoDownload();
    }
  }, [pdfUrls]);

  // Auto download extractor PDF ketika URL tersedia
  useEffect(() => {
    if (extractorPdfUrl && !localExtractorPdfUrl) {
      handleExtractorDownload();
    }
  }, [extractorPdfUrl]);

  const handleAutoDownload = async () => {
    if (pdfUrls.length === 0) return;

    setIsDownloading(true);
    try {
      const localUrls: string[] = [];

      for (const url of pdfUrls) {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to download file from ${url}`);
        }

        const blob = await response.blob();
        const localUrl = URL.createObjectURL(blob);
        localUrls.push(localUrl);
      }

      setLocalPdfUrls(localUrls);
    } catch (error) {
      console.error("Download failed:", error);
      message.error("Failed to download PDF files");
    } finally {
      setIsDownloading(false);
    }
  };

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
      message.error("Failed to download extractor PDF file");
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Extraction Results</h3>
          <Tag color="blue">{Object.keys(result).length} fields extracted</Tag>
        </div>
        <div className="max-h-96 overflow-y-auto gap-[4rem]">{items}</div>
      </div>
    );
  };

  const steps = [
    {
      title: "First",
      content: (
        <div style={{ height: "500px", overflow: "auto", padding: "20px" }}>
          {isDownloading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>Loading PDFs...</p>
            </div>
          ) : localPdfUrls.length > 0 ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {localPdfUrls.map((url, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                    padding: "10px",
                  }}
                >
                  <p>PDF {index + 1}</p>
                  <object
                    data={url}
                    type="application/pdf"
                    width="100%"
                    height="400px"
                    style={{ border: "1px solid #d9d9d9", borderRadius: "4px" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>No audit data found for ID: {selectedData?.uuid}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Second",
      content: (
        <div className="h-full overflow-auto p-4 flex gap-4">
          <div className="w-1/2 border rounded-lg p-4">
            {renderExtractionResult()}
          </div>
          <div className="w-1/2 border rounded-lg p-4">
            {isDownloadingExtractor ? (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>Loading Extractor PDF...</p>
              </div>
            ) : localExtractorPdfUrl ? (
              <div>
                <p>Extractor PDF</p>
                <object
                  data={localExtractorPdfUrl}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                  style={{ border: "1px solid #d9d9d9", borderRadius: "4px" }}
                />
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>No Extractor PDF available</p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Last",
      content: "Last-content",
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <>
      <Steps current={current} items={items} />
      <div
        style={{
          backgroundColor: token.colorFillAlter,
          borderRadius: token.borderRadiusLG,
          border: `1px dashed ${token.colorBorder}`,
          marginTop: 16,
          minHeight: "500px",
        }}
      >
        {steps[current].content}
      </div>
      <div style={{ marginTop: 24 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => setCurrent(current + 1)}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{ margin: "0 8px" }}
            onClick={() => setCurrent(current - 1)}
          >
            Previous
          </Button>
        )}
      </div>
    </>
  );
}

export default DetailAuditTrail;
