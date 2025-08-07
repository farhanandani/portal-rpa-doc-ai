import { Button, Input, message } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // Redirect ke landing page jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/landing-page");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    const success = login(username, password);
    if (success) {
      messageApi.success("Login berhasil!");
      navigate("/landing-page");
    } else {
      messageApi.error("Username atau password salah");
    }
  };

  // Jika sudah login, tidak perlu render form login
  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {contextHolder}
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-auto w-full max-w-[30rem] flex flex-col items-center justify-center border border-gray-500 rounded-lg p-4">
          <p className="text-2xl font-bold">LOGIN</p>
          <div className="h-full w-full flex flex-col gap-6 items-center justify-center">
            <div className="w-full h-full flex flex-col gap-2">
              <p>Username</p>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onPressEnter={handleLogin}
              />
            </div>
            <div className="w-full h-full flex flex-col gap-2">
              <p>Password</p>
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onPressEnter={handleLogin}
              />
            </div>
            <Button className="w-full" type="primary" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
