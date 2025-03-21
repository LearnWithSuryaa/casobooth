import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Validasi agar hanya gambar yang memiliki `imageUrl` yang masuk
  const capturedImages = Array.isArray(location.state?.capturedImages)
    ? location.state.capturedImages.filter(img => img?.imageUrl)
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
  const imgHeight = 225;
  const spacing = 25;
  const borderSize = 30;
  const wmHeight = 70;
  const cornerRadius = 10;
  
  const isGrid = layout === "grid";
  const cols = isGrid ? 2 : 1;
  const rows = Math.ceil(capturedImages.length / cols);
  const totalHeight = rows * imgHeight + (rows - 1) * spacing + 2 * borderSize + wmHeight;
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

    // 🔹 Background dengan Sudut Membulat
    context.fillStyle = frameColor;
    context.beginPath();
    context.moveTo(cornerRadius, 0);
    context.arcTo(canvas.width, 0, canvas.width, canvas.height, cornerRadius);
    context.arcTo(canvas.width, canvas.height, 0, canvas.height, cornerRadius);
    context.arcTo(0, canvas.height, 0, 0, cornerRadius);
    context.arcTo(0, 0, canvas.width, 0, cornerRadius);
    context.closePath();
    context.fill();

    // 🔹 Fungsi menggambar gambar dengan filter
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

    // 🔹 Load & Apply Filter pada Gambar
    const applyFilterAndDraw = (imgData, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = imgData.imageUrl;
        img.crossOrigin = "anonymous";

        img.onload = () => {
          const tempCanvas = document.createElement("canvas");
          const tempCtx = tempCanvas.getContext("2d");
          tempCanvas.width = imgWidth;
          tempCanvas.height = imgHeight;

          tempCtx.filter = imgData.filter || "none";
          tempCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

          const col = isGrid ? index % cols : 0;
          const row = isGrid ? Math.floor(index / cols) : index;
          const xPos = borderSize + col * (imgWidth + spacing);
          const yPos = borderSize + row * (imgHeight + spacing);

          drawRoundedImage(context, tempCanvas, xPos, yPos, imgWidth, imgHeight, cornerRadius);
          resolve();
        };
      });
    };

    await Promise.all(capturedImages.map(applyFilterAndDraw));

    // 🔹 Watermark
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

    // 🔹 Simpan sebagai File (Menggunakan `toBlob()` untuk Efisiensi)
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

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-200 py-30">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Photo Strip Preview</h2>

      {/* Pilihan Warna Frame */}
      <div className="mb-4 flex gap-3">
        {["#ffffff", "#fffac1", "#ffdae2", "#c8deef", "#cfe4bb", "#d5c2f0"].map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 ${
              frameColor === color ? "border-black" : "border-gray-400"
            }`}
            style={{ backgroundColor: color }}
            onClick={() => setFrameColor(color)}
          />
        ))}
      </div>

      {/* Pilihan Layout */}
      <div className="mb-4 flex gap-3">
        <button className={`px-4 py-2 rounded-lg shadow ${layout === "strip" ? "bg-blue-600 text-white" : "bg-gray-300"}`} onClick={() => setLayout("strip")}>Strip Layout</button>
        <button className={`px-4 py-2 rounded-lg shadow ${layout === "grid" ? "bg-blue-600 text-white" : "bg-gray-300"}`} onClick={() => setLayout("grid")}>Grid Layout</button>
      </div>

      {/* Preview Foto */}
      <div className="bg-white p-6 rounded-lg shadow-xl relative" style={{ backgroundColor: frameColor }}>
        <div className={`flex ${layout === "grid" ? "flex-wrap gap-5" : "flex-col items-center gap-5"}`}>
          {capturedImages.map((img, index) => (
            <img key={index} src={img.imageUrl} alt={`Captured ${index + 1}`} className="w-[200px] h-[150px] rounded-lg border-gray-300 shadow-md" style={{ filter: img.filter }} />
          ))}
        </div>
      </div>

      {/* Tombol Download */}
      <button onClick={downloadPhotoStrip} className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition" disabled={isDownloading}>
        {isDownloading ? "Processing..." : "Download Photo Strip"}
      </button>

      {/* Tombol Kembali */}
      <button onClick={() => navigate("/Capture")} className="mt-4 px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition">
        Back to Capture
      </button>
    </div>
  );
}
