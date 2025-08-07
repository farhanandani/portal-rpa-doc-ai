import { Card } from "antd";
import Classifier from "./module/Classifier";
import Extraction from "./module/Extraction";
import ListModelExtraction from "./module/ListModelExtraction";
import UploadFile from "./module/UploadFile";
import ListModelClassification from "./module/ListModelClassification";
import Verification from "./module/Verification";

function ApiIntegration() {
  return (
    <>
      <div className="w-full h-full flex flex-col gap-4">
        <Card className="w-full h-full">
          <div className="flex flex-col gap-4">
            <UploadFile />
            <ListModelClassification />
            <ListModelExtraction />
            <Classifier />
            <Extraction />
            <Verification />
          </div>
        </Card>
      </div>
    </>
  );
}

export default ApiIntegration;
