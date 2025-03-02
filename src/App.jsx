import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import Navbar from "@/components/Navbar"; 

// Lazy load halaman untuk optimasi performa
const Home = lazy(() => import("@/pages/Home"));
const Capture = lazy(() => import("@/pages/Capture"));
const Preview = lazy(() => import("@/pages/Preview")); // Tambahkan Preview
const About = lazy(() => import("@/pages/About"));

export default function App() {
  const [capturedImages, setCapturedImages] = useState([]); // State untuk gambar hasil capture

  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capture" element={<Capture setCapturedImages={setCapturedImages} />} />
          <Route path="/preview" element={<Preview capturedImages={capturedImages} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
