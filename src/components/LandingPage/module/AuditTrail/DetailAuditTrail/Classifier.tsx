import { useState, useEffect } from "react";
import { useDetailAudit } from "../store/useDetailAudit";

function Classifier() {
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

  return (
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
                <p className="font-medium mb-2">PDF {index + 1}</p>
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
      <div className="w-1/2 h-full border rounded-lg p-4 flex flex-col">
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
    </div>
  );
}

export default Classifier;
