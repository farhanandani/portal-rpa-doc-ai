import { useState, useEffect } from "react";
import { useDetailAudit } from "../store/useDetailAudit";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

function Classifier() {
  const navigate = useNavigate();
  const { selectedData } = useDetailAudit();
  const [pdfUrls, setPdfUrls] = useState<string[]>([]);
  const [localPdfUrls, setLocalPdfUrls] = useState<string[]>([]);
  const [annotatedClassifierPdfUrl, setAnnotatedClassifierPdfUrl] =
    useState<string>("");
  const [localAnnotatedClassifierPdfUrl, setLocalAnnotatedClassifierPdfUrl] =
    useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [
    isDownloadingAnnotatedClassifier,
    setIsDownloadingAnnotatedClassifier,
  ] = useState(false);
  const [pdfFileNames, setPdfFileNames] = useState<string[]>([]);
  const [verificationPdfUrl, setVerificationPdfUrl] = useState<string>("");
  const [localVerificationPdfUrl, setLocalVerificationPdfUrl] =
    useState<string>("");
  const [isDownloadingVerification, setIsDownloadingVerification] =
    useState(false);

  // Mencari data berdasarkan UUID
  useEffect(() => {
    const data = selectedData;
    if (data) {
      const paths = data.documentSplithPath
        .split(",")
        .map((path: string) => path.trim())
        .filter((path: string) => path);
      const urls = paths.map(
        (path: string) =>
          `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${path}`
      );
      setPdfUrls(urls);

      // Set annotated classifier PDF URL
      if (data.annotatedClassifierDocumentBlobFilePath) {
        const annotatedClassifierUrl = `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/download/stream/infomediadocairesult/${data.annotatedClassifierDocumentBlobFilePath}`;
        setAnnotatedClassifierPdfUrl(annotatedClassifierUrl);
      }
    }
  }, [selectedData]);

  // Auto download ketika component mount
  useEffect(() => {
    if (pdfUrls.length > 0 && localPdfUrls.length === 0) {
      handleAutoDownload();
    }
  }, [pdfUrls]);

  // Auto download annotated classifier PDF ketika URL tersedia
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
      console.error("Download failed:", error);
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
      console.error("Annotated classifier download failed:", error);
    } finally {
      setIsDownloadingAnnotatedClassifier(false);
    }
  };

  // PDF Viewer
  useEffect(() => {
    const data = selectedData;

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
  }, [selectedData]);

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
      <div className="h-full w-full overflow-auto p-4 flex gap-4">
        <div className="w-1/2 h-full border rounded-lg p-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Document Split</h3>
          {isDownloading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>Loading PDFs...</p>
            </div>
          ) : localPdfUrls.length > 0 ? (
            <div className="flex-1 overflow-y-auto">
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
                    title={`PDF ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>No document split files available</p>
            </div>
          )}
        </div>
        <div className="w-1/2 h-full flex flex-col gap-4">
          <div className="flex-1 border rounded-lg p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Annotated Classifier</h3>
            {isDownloadingAnnotatedClassifier ? (
              <div style={{ textAlign: "center", padding: "50px" }}>
                <p>Loading Annotated Classifier PDF...</p>
              </div>
            ) : localAnnotatedClassifierPdfUrl ? (
              <div className="flex-1 min-h-0">
                <iframe
                  src={`${localAnnotatedClassifierPdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  width="100%"
                  height="100%"
                  style={{ border: "1px solid #d9d9d9", borderRadius: "4px" }}
                  title="Annotated Classifier PDF"
                />
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "50px" }}>
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
      <Button
        type="primary"
        onClick={() => navigate("/landing-page/audit-trail")}
      >
        Done
      </Button>
    </div>
  );
}

export default Classifier;
