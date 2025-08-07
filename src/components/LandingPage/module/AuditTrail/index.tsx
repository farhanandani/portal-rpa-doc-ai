import { Button, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { useGetAuditTrail } from "../../../../react-query/useAuditTrail";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import { type ZGetAuditTrailResponseElement } from "../../../../service/audit-trail/model";
import { useDetailAudit } from "./store/useDetailAudit";

type DataType = any;

function AuditTrail() {
  const navigate = useNavigate();
  const { setSelectedData, setIsVerification } = useDetailAudit();
  const { data: auditTrailData } = useGetAuditTrail();

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
        } else if (value === "verification") {
          return <Tag color="purple">Verification</Tag>;
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
              if (record.module === "verification") {
                setIsVerification(true);
              } else {
                setIsVerification(false);
              }
            }}
          />
        </>
      ),
    },
  ];

  return (
    <>
      <Table<DataType> columns={columns} dataSource={auditTrailData} />
    </>
  );
}

export default AuditTrail;
