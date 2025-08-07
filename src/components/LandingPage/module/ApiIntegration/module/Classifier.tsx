import { CopyOutlined } from "@ant-design/icons";
import { Button, Collapse, type CollapseProps } from "antd";
import JsonDisplay from "./JsonDisplay";

function Classifier() {
  const payloadData = {
    blobPath: "blob-path-file.pdf",
    containerName: "infomediadocairesult",
    modelId: "model-id",
    useAsTrainingData: false,
  };
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "Classifier (POST)",
      children: (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold">URL</p>
          <div className="flex gap-2 justify-between items-center">
            <code>
              {`${import.meta.env.VITE_APP_APP_API_URL_RPA}/classifier/analyze`}
            </code>
            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_APP_APP_API_URL_RPA}/classifier/analyze`
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

export default Classifier;
