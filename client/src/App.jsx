import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlocksworldApp from "./components/BlocksworldApp.jsx";
import About from "./components/About.jsx";
import NavBar from "./components/NavBar.jsx";

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<BlocksworldApp />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}