import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Validasi agar hanya gambar yang memiliki `imageUrl` yang masuk
  const capturedImages = Array.isArray(location.state?.capturedImages)
    ? location.state.capturedImages.filter((img) => img?.imageUrl)
    : [];

  useEffect(() => {
    if (capturedImages.length === 0) {
      navigate("/Capture");
    }
  }, [capturedImages, navigate]);

  const [frameColor, setFrameColor] = useState("#ffffff");
  const [layout, setLayout] = useState("strip");
  const [isDownloading, setIsDownloading] = useState(false);

  const imgWidth = 300;
  const imgHeight = 185;
  const spacing = 25;
  const borderSize = 30;
  const wmHeight = 70;
  const cornerRadius = 10;

  const isGrid = layout === "grid";
  const cols = isGrid ? 2 : 1;
  const rows = Math.ceil(capturedImages.length / cols);
  const totalHeight =
    rows * imgHeight + (rows - 1) * spacing + 2 * borderSize + wmHeight;
  const totalWidth = isGrid
    ? cols * imgWidth + (cols - 1) * spacing + 2 * borderSize
    : imgWidth + 2 * borderSize;

  const downloadPhotoStrip = async () => {
    if (capturedImages.length === 0) return;
    setIsDownloading(true);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Background dengan Sudut Membulat
    context.fillStyle = frameColor;
    context.beginPath();
    context.moveTo(cornerRadius, 0);
    context.arcTo(canvas.width, 0, canvas.width, canvas.height, cornerRadius);
    context.arcTo(canvas.width, canvas.height, 0, canvas.height, cornerRadius);
    context.arcTo(0, canvas.height, 0, 0, cornerRadius);
    context.arcTo(0, 0, canvas.width, 0, cornerRadius);
    context.closePath();
    context.fill();

    // Fungsi menggambar hasil dari canvas yang sudah difilter
    const drawRoundedImage = (ctx, img, x, y, width, height, radius) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, x, y, width, height);
      ctx.restore();
    };

    // Load & Apply Filter pada Gambar
    const applyFilterAndDraw = (imgData, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = imgData.imageUrl;
        img.crossOrigin = "anonymous";
        img.src = imgData.imageUrl;

        img.onload = () => {
          // 1. Gambar dengan filter ke canvas sementara
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          tempCanvas.width = imgWidth;
          tempCanvas.height = imgHeight;

          tempCtx.filter = imgData.filter || "none";
          tempCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

          // 2. Convert hasil canvas ke Image baru (agar filter nempel)
          const filteredImg = new Image();
          filteredImg.onload = () => {
            const col = isGrid ? index % cols : 0;
            const row = isGrid ? Math.floor(index / cols) : index;
            const xPos = borderSize + col * (imgWidth + spacing);
            const yPos = borderSize + row * (imgHeight + spacing);

            drawRoundedImage(
              context,
              filteredImg,
              xPos,
              yPos,
              imgWidth,
              imgHeight,
              cornerRadius
            );
            resolve();
          };
          filteredImg.src = tempCanvas.toDataURL(); // 🎯 filter nempel di sini
        };
      });
    };

    await Promise.all(capturedImages.map(applyFilterAndDraw));

    // Watermark
    context.fillStyle = "#222";
    context.font = "bold 20px Arial";
    context.textAlign = "center";
    context.fillText("Casobooth", canvas.width / 2, totalHeight - 60);
    context.font = "16px Arial";
    context.fillText(
      `📸 ${new Date().toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      canvas.width / 2,
      totalHeight - 40
    );

    // Simpan sebagai File
    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "casobooth_photo_strip.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, "image/png");
  };

  // Web Share API
  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Check out my Casobooth photo strip!",
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex flex-col items-center px-6 py-10 relative"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      {/* Overlay blur */}
      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-sm z-0" />

      {/* Konten utama */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl py-25">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          Photo Strip Preview
        </h2>

        {/* Pilih Warna Frame */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {[
            "#ffffff",
            "#fffac1",
            "#ffdae2",
            "#c8deef",
            "#cfe4bb",
            "#d5c2f0",
          ].map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                frameColor === color
                  ? "border-pink-500 scale-110"
                  : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFrameColor(color)}
            />
          ))}
        </div>

        {/* Pilih Layout */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-5 py-2 rounded-full font-semibold transition-all shadow cursor-pointer ${
              layout === "strip"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setLayout("strip")}
          >
            Strip Layout
          </button>
          <button
            className={`px-5 py-2 rounded-full font-semibold transition-all shadow cursor-pointer ${
              layout === "grid"
                ? "bg-pink-500 text-white"
                : "bg-white text-gray-700"
            }`}
            onClick={() => setLayout("grid")}
          >
            Grid Layout
          </button>
        </div>

        {/* Preview */}
        <div
          className="p-6 rounded-2xl shadow-xl bg-white/90 backdrop-blur-md"
          style={{ backgroundColor: frameColor }}
        >
          <div
            className={`flex overflow-x-auto scrollbar-thin ${
              layout === "grid"
                ? "flex-row gap-4"
                : "flex-col items-center gap-4"
            }`}
          >
            {capturedImages.map((img, idx) => (
              <img
                key={idx}
                src={img.imageUrl}
                alt={`Captured ${idx + 1}`}
                style={{ filter: img.filter }}
                className="w-[200px] h-[150px] object-cover rounded-xl shadow-md"
              />
            ))}
          </div>
        </div>

        <p className="text-base sm:text-lg text-gray-800 mt-4 leading-relaxed px-2 sm:px-4 text-center">
        "Filter saat ini masih dalam tahap pengembangan, jadi hasilnya mungkin tidak sesuai harapan. Mohon bersabar ya! 😊"
      </p>

        {/* Tombol Aksi */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={downloadPhotoStrip}
            className="bg-gradient-to-r from-pink-500 to-pink-400 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:brightness-105 transition-all cursor-pointer"
            disabled={isDownloading}
          >
            {isDownloading ? "Processing..." : "Download Photo Strip"}
          </button>

          <button
            onClick={() => navigate("/Capture")}
            className="bg-gray-700 text-white px-6 py-3 rounded-2xl font-medium shadow hover:bg-gray-800 transition-all cursor-pointer"
          >
            Back to Capture
          </button>

          <button
            onClick={handleShare}
            className="bg-white text-pink-600 px-6 py-3 rounded-2xl font-medium border border-pink-400 hover:bg-pink-50 transition-all shadow-sm cursor-pointer"
          >
            Share
          </button>

          <button
            onClick={handleCopyLink}
            className="bg-white text-gray-600 px-6 py-3 rounded-2xl font-medium border border-gray-300 hover:bg-gray-100 transition-all shadow-sm cursor-pointer"
          >
            Copy Link
          </button>
        </div>
      </div>
    </div>
  );
}
