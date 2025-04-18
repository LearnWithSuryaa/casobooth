import { useRef, useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const filters = [
  { name: "Normal", value: "none" },
  { name: "Grayscale", value: "grayscale(100%)" },
  { name: "Sepia", value: "sepia(100%)" },
  { name: "Invert", value: "invert(100%)" },
  { name: "Brightness", value: "brightness(150%)" },
  { name: "Contrast", value: "contrast(200%)" },
];

export default function Capture({ setCapturedImages = () => {} }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImages, setImages] = useState([]);
  const [filter, setFilter] = useState("none");
  const [countdown, setCountdown] = useState(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    startCamera();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.filter = filter;
    }
  }, [filter]);

  const handleFilterChange = (value) => {
    if (!capturing) {
      setFilter(value);
    }
  };

  const handleVisibilityChange = () => {
    if (!document.hidden) startCamera();
  };

  const startCamera = async () => {
    try {
      if (videoRef.current?.srcObject) return;
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720, frameRate: 30 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Hanya panggil play() jika video belum berjalan
        if (videoRef.current.readyState >= 2) {
          videoRef.current.play();
        }

        videoRef.current.style.transform = "scaleX(-1)";
        videoRef.current.style.objectFit = "cover";
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const startCountdown = () => {
    if (capturing) return;
    setCapturing(true);

    let photosTaken = 0;
    const newCapturedImages = [];

    const captureSequence = async () => {
      let photosTaken = 0;
      const newCapturedImages = [];

      const capture = async () => {
        if (photosTaken >= 4) {
          setCountdown(null);
          setCapturing(false);
          setCapturedImages([...newCapturedImages]); // Simpan ke global state
          setImages([...newCapturedImages]); // Simpan lokal
          console.log("Captured Images:", newCapturedImages);
          navigate("/preview", {
            state: { capturedImages: newCapturedImages },
          });
          return;
        }

        let timeElapsed = 3;
        setCountdown(timeElapsed);

        const timer = setInterval(() => {
          timeElapsed -= 1;
          setCountdown(timeElapsed);

          if (timeElapsed === 1) {
            clearInterval(timer);
            setTimeout(() => {
              triggerFlash();
              const captured = capturePhoto();
              if (captured) {
                newCapturedImages.push({ imageUrl: captured, filter }); // ✅ Filter ikut disimpan
                setImages((prevImages) => [
                  ...prevImages,
                  { imageUrl: captured, filter },
                ]);
              }
              photosTaken += 1;
              setTimeout(capture, 1000);
            }, 500);
          }
        }, 1000);
      };

      capture();
    };

    captureSequence();
  };

  const triggerFlash = () => {
    const flash = document.createElement("div");
    flash.style.position = "fixed";
    flash.style.top = "0";
    flash.style.left = "0";
    flash.style.width = "100vw";
    flash.style.height = "100vh";
    flash.style.background = "white";
    flash.style.opacity = "0.8";
    flash.style.transition = "opacity 0.3s ease-in-out";
    document.body.appendChild(flash);
    setTimeout(() => document.body.removeChild(flash), 300);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      const targetWidth = 1280;
      const targetHeight = 720;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      context.save();
      context.filter = filter; // 🔹 Terapkan filter langsung ke gambar
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
      context.drawImage(video, 0, 0, targetWidth, targetHeight);
      context.restore();

      return canvas.toDataURL("image/png"); // Simpan gambar dengan filter
    }
  };

  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4 sm:px-6 py-10 relative">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-pink-900 mb-6 drop-shadow-lg text-center">
        Casobooth Capture
      </h2>

      <div className="relative flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 bg-pink-100/80 p-4 sm:p-6 rounded-xl shadow-xl">
        {/* Live Camera */}
        <div className="w-full sm:w-[400px] h-[250px] sm:h-[300px] bg-black rounded-lg shadow-xl overflow-hidden flex-shrink-0">
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full rounded-lg"
          ></video>
        </div>

        {/* Captured Photos in Grid */}
        <div className="mt-4 sm:mt-0 grid grid-cols-2 sm:grid-cols-2 gap-2">
          {capturedImages.slice(0, 4).map((img, index) => (
            <motion.img
              key={index}
              src={img.imageUrl}
              alt={`Captured ${index + 1}`}
              className="w-[140px] h-[90px] sm:w-[230px] sm:h-[145px] rounded-md border-pink-400 shadow-lg"
              style={{ filter: img.filter }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Filter Buttons */}
      <div className="mt-6 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            disabled={capturing}
            className={`px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-lg border-2
            transition-all duration-300 ease-in-out shadow-md
            ${
              filter === f.value
                ? "border-pink-600 bg-pink-400 text-white shadow-lg"
                : " bg-pink-300 text-gray-800 hover:bg-pink-400 hover:border-pink-500"
            }
            ${capturing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Capture Button */}
      <div className="flex gap-4 mt-6 sm:mt-8">
        <button
          onClick={startCountdown}
          disabled={capturing}
          className={`px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold border-2 border-black rounded-full bg-pink-600 text-white transition-all shadow-lg hover:shadow-2xl flex items-center gap-2
          ${capturing ? "opacity-50 cursor-not-allowed" : "hover:bg-pink-700"}`}
        >
          <FaCamera /> Start Capture
        </button>
      </div>

      {/* Countdown */}
      {countdown !== null && (
        <motion.div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-4xl sm:text-5xl font-bold px-6 py-3 rounded-lg">
          {countdown}
        </motion.div>
      )}
    </div>
  );
}
