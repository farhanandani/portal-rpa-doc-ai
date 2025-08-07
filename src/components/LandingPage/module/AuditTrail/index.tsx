import { Button, Table, Tag } from "antd";
import type { TableProps } from "antd";
// import { useGetAuditTrail } from "../../../../react-query/useAuditTrail";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { type ZGetDocumentExtractionResponseElement } from "../../../../service/audit-trail/model";
import { useDetailAudit } from "./store/useDetailAudit";
import apa from "./sample.json";

type DataType = ZGetDocumentExtractionResponseElement;

function AuditTrail() {
  //   const { data: auditTrailData } = useGetAuditTrail();
  const navigate = useNavigate();
  const { setSelectedData } = useDetailAudit();

  const convertedData: DataType[] = apa.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    module: item.module as "classifier" | "extractor",
  }));

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Session ID",
      dataIndex: "sessionId",
      key: "sessionId",
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      render: (value: string) => {
        if (value === "classifier") {
          return <Tag color="blue">Classifier</Tag>;
        } else if (value === "extractor") {
          return <Tag color="green">Extractor</Tag>;
        }
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: any) => {
        try {
          const dateValue = value instanceof Date ? value : new Date(value);

          if (isNaN(dateValue.getTime())) {
            return "Invalid Date";
          }

          return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(dateValue);
        } catch (error) {
          return "Invalid Date";
        }
      },
    },
    {
      title: "Processed In Seconds",
      dataIndex: "processedInSeconds",
      key: "processedInSeconds",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Button
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => {
              navigate(`/landing-page/audit-trail/${record.uuid}`);
              setSelectedData(record);
            }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Table<DataType> columns={columns} dataSource={convertedData} />
    </>
  );
}

export default AuditTrail;
