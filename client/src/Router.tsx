import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import AuthLogin from "./pages/auth/AuthLogin";
import Driver from "./pages/driver/Driver";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route index path="/login" element={<AuthLogin />} />
        <Route index path="/driver" element={<Driver />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
