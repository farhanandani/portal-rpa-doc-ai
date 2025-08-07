import { Card, Collapse, type CollapseProps } from "antd";

const text = `
A dog is a type of domesticated animal.
Known for its loyalty and faithfulness,
it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "API Integration",
    children: <p>{text}</p>,
  },
];
function ApiIntegration() {
  return (
    <>
      <div className="w-full h-full flex flex-col gap-4">
        <Card className="w-full h-full">
          <div className="flex flex-col gap-4">
            <div>
              <Collapse defaultActiveKey={["1"]} ghost items={items} />
            </div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos. 
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}

export default ApiIntegration;
