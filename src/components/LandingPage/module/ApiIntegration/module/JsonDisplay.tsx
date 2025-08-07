import { CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface JsonDisplayProps {
  data: any;
  title?: string;
}

const JsonDisplay = ({ data, title }: JsonDisplayProps) => {
  const formattedJson = JSON.stringify(data, null, 2);

  return (
    <div className="flex flex-col gap-2">
      {title && <p className="text-sm font-bold">{title}</p>}
      <div className="flex gap-2 justify-between items-start">
        <code className="whitespace-pre-wrap bg-gray-50 p-3 rounded border text-sm">
          {formattedJson}
        </code>
        <Button
          onClick={() => navigator.clipboard.writeText(formattedJson)}
          size="small"
        >
          <CopyOutlined />
        </Button>
      </div>
    </div>
  );
};

export default JsonDisplay;
