import { Layout, Menu } from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const { Header, Content } = Layout;

function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "1":
        navigate("/landing-page/classification");
        break;
      case "2":
        navigate("/landing-page/extraction");
        break;
      case "3":
        navigate("/landing-page/verification");
        break;
      case "4":
        navigate("/landing-page/audit-trail");
        break;
      case "5":
        navigate("/landing-page/api-integration");
        break;
      case "6":
        handleLogout();
        break;
      default:
        break;
    }
  };

  const items = [
    {
      key: "1",
      label: "Classification",
    },
    {
      key: "2",
      label: "Extraction",
    },
    {
      key: "3",
      label: "Verification",
    },
    {
      key: "4",
      label: "Audit Trail",
    },
    {
      key: "5",
      label: "API Integration",
    },
    {
      key: "6",
      label: "Log Out",
    },
  ];

  // Menentukan selected key berdasarkan current location
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/classification")) return ["1"];
    if (path.includes("/extraction")) return ["2"];
    if (path.includes("/verification")) return ["3"];
    if (path.includes("/audit-trail")) return ["4"];
    if (path.includes("/api-integration")) return ["5"];
    if (path.includes("/login")) return ["6"];
    return ["1"]; // default
  };

  return (
    <>
      <div className="h-screen w-screen">
        <Layout style={{ height: "100%", width: "100%" }}>
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={getSelectedKey()}
              items={items}
              onClick={handleMenuClick}
              style={{ flex: 1, minWidth: 0 }}
            />
          </Header>
          <Content style={{ padding: "24px", height: "calc(100vh - 64px)" }}>
            <Outlet />
          </Content>
        </Layout>
      </div>
    </>
  );
}

export default LandingPage;
