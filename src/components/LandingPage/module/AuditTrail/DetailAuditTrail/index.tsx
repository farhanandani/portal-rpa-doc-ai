import { useDetailAudit } from "../store/useDetailAudit";
import Classifier from "./Classifier";
import Extractor from "./Extractor";
import Verification from "./Verification";

function DetailAuditTrail() {
  const { selectedData } = useDetailAudit();

  // Conditional rendering berdasarkan module
  const renderComponent = () => {
    switch (selectedData?.module) {
      case "classifier":
        return <Classifier />;
      case "extractor":
        return <Extractor />;
      case "verification":
        return <Verification />;
      default:
        return (
          <div className="w-full h-[calc(100vh-200px)] flex items-center justify-center">
            <p className="text-gray-500">
              Module tidak dikenali: {selectedData?.module}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full overflow-auto border border-gray-300 rounded-lg p-2">
      {renderComponent()}
    </div>
  );
}

export default DetailAuditTrail;
