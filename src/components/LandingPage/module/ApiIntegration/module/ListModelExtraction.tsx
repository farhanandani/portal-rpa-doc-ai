import { CopyOutlined } from "@ant-design/icons";
import { Button, Collapse, type CollapseProps } from "antd";

function ListModelExtraction() {
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: "List Model Extraction (GET)",
      children: (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-bold">URL</p>
          <div className="flex gap-2 justify-between items-center">
            <code>
              {`${import.meta.env.VITE_APP_APP_API_URL_RPA}/extraction/models`}
            </code>
            <Button
              onClick={() =>
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_APP_APP_API_URL_RPA}/extraction/models`
                )
              }
            >
              <CopyOutlined />
            </Button>
          </div>
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

export default ListModelExtraction;
