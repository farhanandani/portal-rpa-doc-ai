import { Steps, Progress, Button, Tag } from "antd";
import { useEffect, useState } from "react";
import { useDetailAudit } from "../store/useDetailAudit";
import { useGetDetailVerification } from "../../../../../react-query/useAuditTrail";

// Fungsi untuk memformat field name menjadi lebih readable
const formatFieldName = (fieldName: string) => {
  return fieldName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Fungsi untuk memetakan data extraction result
const mapExtractionData = (extractionData: any) => {
  if (!extractionData || typeof extractionData !== "object") {
    return [];
  }

  return Object.entries(extractionData).map(
    ([fieldName, fieldData]: [string, any]) => {
      const formattedFieldName = formatFieldName(fieldName);
      const value = fieldData?.valueString || fieldData?.content || "N/A";
      const confidence = fieldData?.confidence ? fieldData.confidence * 100 : 0;

      return {
        fieldName: formattedFieldName,
        value,
        confidence,
        originalFieldName: fieldName,
      };
    }
  );
};

function Verification() {
  const { selectedData } = useDetailAudit();
  const [currentStep, setCurrentStep] = useState(0);

  // Extractor URL
  const [extractorPdfUrl, setExtractorPdfUrl] = useState<string>("");
  const [localExtractorPdfUrl, setLocalExtractorPdfUrl] = useState<string>("");
  const [isDownloadingExtractor, setIsDownloadingExtractor] = useState(false);

  // Classifier URL
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [localPdfUrls, setLocalPdfUrls] = useState<string[]>([]);
  const [pdfFileNames, setPdfFileNames] = useState<string[]>([]);
  const [localAnnotatedClassifierPdfUrl, setLocalAnnotatedClassifierPdfUrl] =
    useState<string>("");
  const [annotatedClassifierPdfUrl, setAnnotatedClassifierPdfUrl] =
    useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [
    isDownloadingAnnotatedClassifier,
    setIsDownloadingAnnotatedClassifier,
  ] = useState(false);

  // Verification URL
  const [verificationPdfUrl, setVerificationPdfUrl] = useState<string>("");
  const [localVerificationPdfUrl, setLocalVerificationPdfUrl] =
    useState<string>("");
  const [isDownloadingVerification, setIsDownloadingVerification] =
    useState(false);
  // ---------------

  const { data: dataVerification, isLoading } = useGetDetailVerification({
    sessionId:
      selectedData?.sessionId ||
      (Array.isArray(selectedData) ? selectedData[0]?.sessionId : "") ||
      "",
  });

  // Memetakan data classifier
  const classifierData = dataVerification?.find(
    (item: any) => item.module === "classifier"
  );

  // Memetakan data extraction
  const extractorData = dataVerification?.find(
    (item: any) => item.module === "extractor"
  );

  // Memetakan data verification
  const verificationData = dataVerification?.find(
    (item: any) => item.module === "verification"
  );

  const mappedExtractionData = mapExtractionData(
    extractorData?.extractionResult
  );

  // useEffect untuk verification PDF - menggunakan verificationData langsung
  useEffect(() => {
    if (verificationData) {
      if (verificationData.documentBlobFilePath) {
        const verificationUrl = `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${verificationData.documentBlobFilePath}`;
        setVerificationPdfUrl(verificationUrl);
      } else {
        console.log("No documentBlobFilePath found or it's empty");
      }
    }
  }, [verificationData]);

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

  useEffect(() => {
    if (extractorData) {
      if (extractorData.annotatedExtractorDocumentBlobFilePath) {
        const extractorUrl = `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${extractorData.annotatedExtractorDocumentBlobFilePath}`;
        setExtractorPdfUrl(extractorUrl);
      } else {
        console.log(
          "No annotatedExtractorDocumentBlobFilePath found or it's empty"
        );
      }
    }
  }, [extractorData]);

  useEffect(() => {
    if (extractorPdfUrl && !localExtractorPdfUrl) {
      handleExtractorDownload();
    }
  }, [extractorPdfUrl]);

  const handleExtractorDownload = async () => {
    if (!extractorPdfUrl) {
      return;
    }

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

  // Memetakan data classifier
  useEffect(() => {
    const data = classifierData;

    if (data) {
      const paths = data.documentSplithPath
        .split(",")
        .map((path: string) => path.trim())
        .filter((path: string) => path);

      // Ekstrak nama file dari path
      const fileNames = paths.map((path: string) => {
        const pathParts = path.split("/");
        return pathParts[pathParts.length - 1] || "Unknown File";
      });

      const urls = paths.map(
        (path: string) =>
          `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${path}`
      );

      setPdfUrls(urls);
      setPdfFileNames(fileNames);

      // Set annotated classifier PDF URL
      if (data.annotatedClassifierDocumentBlobFilePath) {
        const annotatedClassifierUrl = `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${data.annotatedClassifierDocumentBlobFilePath}`;
        setAnnotatedClassifierPdfUrl(annotatedClassifierUrl);
      } else {
      }
    } else {
    }
  }, [classifierData]);

  useEffect(() => {
    if (pdfUrls.length > 0 && localPdfUrls.length === 0) {
      handleAutoDownload();
    }
  }, [pdfUrls]);

  useEffect(() => {
    if (annotatedClassifierPdfUrl && !localAnnotatedClassifierPdfUrl) {
      handleAnnotatedClassifierDownload();
    }
  }, [annotatedClassifierPdfUrl]);

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
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAnnotatedClassifierDownload = async () => {
    if (!annotatedClassifierPdfUrl) return;

    setIsDownloadingAnnotatedClassifier(true);
    try {
      const response = await fetch(annotatedClassifierPdfUrl);
      if (!response.ok) {
        throw new Error(
          `Failed to download annotated classifier file from ${annotatedClassifierPdfUrl}`
        );
      }

      const blob = await response.blob();
      const localUrl = URL.createObjectURL(blob);
      setLocalAnnotatedClassifierPdfUrl(localUrl);
    } catch (error) {
    } finally {
      setIsDownloadingAnnotatedClassifier(false);
    }
  };

  // Fungsi untuk mendapatkan status verification
  const getVerificationStatus = (result: string) => {
    switch (result.toLowerCase()) {
      case "success":
        return { color: "success", text: "Berhasil" };
      case "failed":
        return { color: "error", text: "Gagal" };
      default:
        return { color: "default", text: "Tidak Diketahui" };
    }
  };

  const steps = [
    {
      title: "Classifier",
      content: (
        <div className="h-full w-full overflow-auto p-4 flex gap-4">
          <div
            className="w-1/2 border rounded-lg p-4 flex flex-col"
            style={{ minHeight: "500px", height: "100%" }}
          >
            <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
              Document Split
            </h3>
            {isDownloading ? (
              <div className="flex-1 flex items-center justify-center">
                <p>Loading PDFs...</p>
              </div>
            ) : localPdfUrls.length > 0 ? (
              <div className="flex-1 overflow-y-auto min-h-0">
                {localPdfUrls.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "8px",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <p className="font-medium mb-2">
                      {pdfFileNames[index] || `PDF ${index + 1}`}
                    </p>
                    <iframe
                      src={`${url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                      width="100%"
                      height="400px"
                      style={{
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                      }}
                      title={pdfFileNames[index] || `PDF ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p>No document split files available</p>
              </div>
            )}
          </div>
          <div
            className="w-1/2 flex flex-col gap-4"
            style={{ minHeight: "500px", height: "100%" }}
          >
            <div className="flex-1 border rounded-lg p-4 flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
                Annotated Classifier
              </h3>
              {isDownloadingAnnotatedClassifier ? (
                <div className="flex-1 flex items-center justify-center">
                  <p>Loading Annotated Classifier PDF...</p>
                </div>
              ) : localAnnotatedClassifierPdfUrl ? (
                <div className="flex-1 min-h-0">
                  <iframe
                    src={`${localAnnotatedClassifierPdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                    width="100%"
                    height="100%"
                    style={{
                      border: "1px solid #d9d9d9",
                      borderRadius: "4px",
                    }}
                    title="Annotated Classifier PDF"
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p>No Annotated Classifier PDF available</p>
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
      ),
    },
    {
      title: "Extractor",
      content: (
        <div className="h-full w-full overflow-auto p-4 flex gap-4">
          <div
            className="w-1/2 border rounded-lg p-4 flex flex-col"
            style={{ minHeight: "500px" }}
          >
            <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
              Extraction Result
            </h3>
            {isLoading ? (
              <div className="bg-gray-50 p-4 rounded flex-1 min-h-0">
                <p>Loading extraction data...</p>
              </div>
            ) : mappedExtractionData.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex-shrink-0">
                  <h4 className="font-medium text-gray-700">
                    Extracted Fields
                  </h4>
                </div>
                <div className="flex-1 overflow-y-auto min-h-0">
                  {mappedExtractionData.map((item, index) => (
                    <div
                      key={item.originalFieldName}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-800 text-sm">
                          {item.fieldName}
                        </h5>
                        <div className="flex items-center gap-2 w-24 flex-shrink-0">
                          <Progress
                            type="line"
                            percent={item.confidence}
                            size="small"
                            strokeColor={
                              item.confidence >= 80
                                ? "#52c41a"
                                : item.confidence >= 60
                                  ? "#faad14"
                                  : "#ff4d4f"
                            }
                            format={(percent) => `${percent?.toFixed(0)}%`}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 break-words">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded flex-1 min-h-0">
                <p>Tidak ada data extraction yang ditemukan</p>
              </div>
            )}
          </div>
          <div
            className="w-1/2 flex flex-col gap-4"
            style={{ minHeight: "500px" }}
          >
            <div className="flex-1 border rounded-lg p-4 flex flex-col">
              <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
                Annotated Extractor
              </h3>
              <div className="w-full flex-1 bg-gray-50 rounded min-h-0">
                {(() => {
                  if (isDownloadingExtractor) {
                    return (
                      <div className="h-full flex items-center justify-center">
                        <p>Loading Extractor PDF...</p>
                      </div>
                    );
                  } else if (localExtractorPdfUrl) {
                    return (
                      <iframe
                        src={`${localExtractorPdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                        width="100%"
                        height="100%"
                        style={{
                          border: "1px solid #d9d9d9",
                          borderRadius: "4px",
                        }}
                        title="Extractor PDF"
                      />
                    );
                  } else {
                    return (
                      <div className="h-full flex flex-col items-center justify-center">
                        <p>No Extractor PDF available</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Debug: extractorPdfUrl=
                          {extractorPdfUrl ? "Set" : "Not set"}
                        </p>
                      </div>
                    );
                  }
                })()}
              </div>
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
      ),
    },
    {
      title: "Verification",
      content: (
        <div className="h-full w-full overflow-auto p-4 flex gap-4">
          <div
            className="w-1/2 border rounded-lg p-4 flex flex-col"
            style={{ minHeight: "500px" }}
          >
            <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
              Verification Result
            </h3>
            {isLoading ? (
              <div className="bg-gray-50 p-4 rounded flex-1 min-h-0">
                <p>Loading verification data...</p>
              </div>
            ) : verificationData?.verificationResult ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 flex flex-col min-h-0">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex-shrink-0">
                  <h4 className="font-medium text-gray-700">
                    Verification Results
                  </h4>
                </div>
                <div className="flex-1 overflow-y-auto min-h-0">
                  {verificationData.verificationResult.verificationResult?.map(
                    (item: any, index: number) => {
                      const status = getVerificationStatus(
                        item.verificationResult
                      );
                      return (
                        <div
                          key={index}
                          className={`px-4 py-3 border-b border-gray-100 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-800 text-sm flex-1">
                              Rule {index + 1}
                            </h5>
                            <Tag color={status.color} className="flex-shrink-0">
                              {status.text}
                            </Tag>
                          </div>
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">
                              Verification Rule:
                            </p>
                            <p className="text-sm text-gray-700 font-medium">
                              {item.verificationRule}
                            </p>
                          </div>
                          <div className="mb-2">
                            <p className="text-xs text-gray-500 mb-1">
                              Document Value:
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.verificationData?.[0]?.documentValue ||
                                "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Reason:
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.verificationReason}
                            </p>
                          </div>
                          <div className="mt-2">
                            <Progress
                              type="line"
                              percent={
                                item.confidence ? item.confidence * 100 : 0
                              }
                              size="small"
                              strokeColor={
                                item.confidence >= 0.8
                                  ? "#52c41a"
                                  : item.confidence >= 0.6
                                    ? "#faad14"
                                    : "#ff4d4f"
                              }
                              format={(percent) => `${percent?.toFixed(0)}%`}
                            />
                          </div>
                        </div>
                      );
                    }
                  ) || (
                    <div className="px-4 py-3">
                      <p className="text-gray-500">
                        Tidak ada data verification yang ditemukan
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded flex-1 min-h-0">
                <p>Tidak ada data verification yang ditemukan</p>
              </div>
            )}
          </div>
          <div
            className="w-1/2 border rounded-lg p-4 flex flex-col"
            style={{ minHeight: "500px" }}
          >
            <h3 className="text-lg font-semibold mb-4 flex-shrink-0">
              PDF Viewer
            </h3>
            <div className="w-full flex-1 bg-gray-50 rounded min-h-0">
              {(() => {
                if (isDownloadingVerification) {
                  return (
                    <div className="h-full flex items-center justify-center">
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
                    <div className="h-full flex flex-col items-center justify-center">
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
      ),
    },
  ];

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  return (
    <div className="w-full flex flex-col h-full">
      <Steps
        current={currentStep}
        items={items}
        onChange={setCurrentStep}
        className="mb-6"
      />
      <div className="flex-1 min-h-0">{steps[currentStep]?.content}</div>
      <div className="flex gap-2 ml-4 mt-4">
        <Button type="primary" onClick={() => setCurrentStep(currentStep - 1)}>
          Previous
        </Button>
        <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default Verification;
