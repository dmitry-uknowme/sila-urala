import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import AuthLogin from "./pages/auth/AuthLogin";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route index path="/login" element={<AuthLogin />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
