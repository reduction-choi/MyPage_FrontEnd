import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./Portfolio.tsx";
import Saving from "./Saving.tsx";

export default function App() {
  return (
    <BrowserRouter basename="/MyPage_FrontEnd">
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/saving" element={<Saving />} />
      </Routes>
    </BrowserRouter>
  );
}
