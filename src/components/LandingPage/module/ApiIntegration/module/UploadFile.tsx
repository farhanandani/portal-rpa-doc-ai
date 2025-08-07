import { CopyOutlined } from "@ant-design/icons";
import { Button, Collapse, type CollapseProps } from "antd";
import JsonDisplay from "./JsonDisplay";

function UploadFile() {
  const response = {
    success: true,
    message: "Uploaded 1 files successfully",
    results: [
      {
        success: true,
        originalName: "ktp jowoki.jpeg",
        blobPath: "tssc/ticket-id-123/ktp jowoki.jpeg",
        etag: '"0x8DDD590AA61F5F4"',
        lastModified: "2025-08-07T08:59:06.000Z",
        requestId: "a3e40948-901e-002a-2079-0710e9000000",
        fileSize: 10178,
        mimetype: "image/jpeg",
      },
    ],
    errors: [],
    totalFiles: 1,
    successfulUploads: 1,
    failedUploads: 0,
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Upload File (POST)",
      children: (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold">URL</p>
          <div className="flex gap-2 justify-between">
            <code>
              {`${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/upload/files/infomediadocairesult/tssc/{path}`}
            </code>
            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_APP_APP_API_URL_RPA}/azure-storage/upload/files/infomediadocairesult/tssc/{path}`
                )
              }
            >
              <CopyOutlined />
            </Button>
          </div>
          <JsonDisplay
            data={{
              file: "file.pdf",
            }}
            title="Payload"
          />
          <JsonDisplay data={response} title="Response" />
        </div>
      ),
    },
  ];

  return (
    <>
      <div>
        <Collapse items={items} />
      </div>
    </>
  );
}

export default UploadFile;
