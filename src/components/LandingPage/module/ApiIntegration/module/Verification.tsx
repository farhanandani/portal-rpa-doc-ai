import { CopyOutlined } from "@ant-design/icons";
import { Button, Collapse, type CollapseProps } from "antd";
import JsonDisplay from "./JsonDisplay";

function Verification() {
  const payloadData = {
    blobPath: "blob-path-file.pdf",
    containerName: "infomediadocairesult ",
    classifierModelId: "classification-docai",
    rules: [
      "Nama vendor pada dokumen BAST harus tertulis atas nama Sigma",
      "Nomor dokumen yg tertera pada BAST harus terisi dengan nomor berikut: Tel. 1082/BAST/NOVEMBER/DR1-1D000000/2024",
      "Tanggal kontrak pada BAST harus lebih rendah dari tanggal dokumen pada BAST",
    ],
  };
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Verification (POST)",
      children: (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold">URL</p>
          <div className="flex gap-2 justify-between items-center">
            <code>
              {`${import.meta.env.VITE_APP_APP_API_URL_RPA}/verification/analyze`}
            </code>
            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_APP_APP_API_URL_RPA}/verification/analyze`
                )
              }
            >
              <CopyOutlined />
            </Button>
          </div>
          <JsonDisplay data={payloadData} title="Payload" />
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

export default Verification;
