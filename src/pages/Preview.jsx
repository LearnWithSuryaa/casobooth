import { useState, useRef } from "react";
import { toPng } from "html-to-image"; // Ganti dom-to-image dengan html-to-image
import { Loader2 } from "lucide-react"; // Untuk ikon loading

const frameColors = {
  white: "#ffffff",
  black: "#000000",
  pink: "#ff66b2",
  green: "#4caf50",
  yellow: "#ffeb3b",
};

const stickers = [
  { name: "No Stickers", value: null },
  { name: "🎀 Girlypop", value: "🎀" },
  { name: "🐱 Mofusand", value: "🐱" },
  { name: "💖 Cute", value: "💖" },
];

export default function PhotoStripPreview({ capturedImages = [] }) {
  const [frameColor, setFrameColor] = useState("white");
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const stripRef = useRef(null);
  const [isRendering, setIsRendering] = useState(false);

  const waitForImagesToLoad = async () => {
    const images = stripRef.current?.querySelectorAll("img") || [];
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        });
      })
    );
  };

  const downloadPhotoStrip = async () => {
    if (!stripRef.current || capturedImages.length === 0) {
      setErrorMessage("Tidak ada gambar untuk di-download!");
      return;
    }

    setIsRendering(true);
    await waitForImagesToLoad();

    toPng(stripRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "photo_strip.png";
        link.click();
      })
      .catch((error) => {
        setErrorMessage("Gagal membuat screenshot: " + error.message);
        console.error("Gagal membuat screenshot:", error);
      })
      .finally(() => {
        setIsRendering(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-pink-300 flex flex-col items-center py-24 px-4 sm:px-6">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
        Photo Strip Preview
      </h2>
      <p className="text-gray-700 mb-4 text-center">
        Customize your photo strip
      </p>

      {/* Frame Color Selection */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {Object.entries(frameColors).map(([color, hex]) => (
          <button
            key={color}
            onClick={() => setFrameColor(color)}
            className={`px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-lg border-2 shadow-md transition-all duration-300 ${
              frameColor === color
                ? "border-pink-600 bg-pink-400 text-white shadow-lg"
                : "bg-pink-300 text-gray-800 hover:bg-pink-400 hover:border-pink-500"
            }`}
          >
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </button>
        ))}
      </div>

      {/* Sticker Selection */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {stickers.map((sticker) => (
          <button
            key={sticker.value}
            onClick={() => setSelectedSticker(sticker.value)}
            className={`px-4 sm:px-5 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-lg border-2 shadow-md transition-all duration-300 ${
              selectedSticker === sticker.value
                ? "border-pink-600 bg-pink-400 text-white shadow-lg"
                : "bg-pink-300 text-gray-800 hover:bg-pink-400 hover:border-pink-500"
            }`}
          >
            {sticker.name}
          </button>
        ))}
      </div>

      {/* Photo Strip */}
      <div
        ref={stripRef}
        className="p-4 rounded-lg shadow-lg relative flex flex-col items-center gap-1"
        style={{
          backgroundColor: frameColors[frameColor],
          width: "100%",
          maxWidth: "260px",
          minHeight: "900px",
          padding: "15px",
        }}
      >
        {capturedImages.length === 0 ? (
          <p className="text-gray-600 text-center">
            Belum ada foto yang diambil
          </p>
        ) : (
          capturedImages.map((img, index) => (
            <div key={index} className="relative mb-3 w-full">
              <img
                src={img.imageUrl}
                alt={`Captured ${index + 1}`}
                className="w-full h-64 object-cover rounded-md"
                style={{ filter: img.filter }}
              />
              {selectedSticker && (
                <div className="absolute inset-0 flex flex-wrap items-center justify-between p-1">
                  {[...Array(4)].map((_, i) => (
                    <span
                      key={i}
                      className="absolute text-xs opacity-80"
                      style={{
                        position: "absolute",
                        top: i % 2 === 0 ? "5px" : "auto",
                        bottom: i % 2 !== 0 ? "5px" : "auto",
                        left: i < 2 ? "5px" : "auto",
                        right: i >= 2 ? "5px" : "auto",
                      }}
                    >
                      {selectedSticker}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}

        {/* Watermark */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-600 text-xs font-semibold opacity-80 whitespace-nowrap">
          © {new Date().getFullYear()} Casofin Photo Booth
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadPhotoStrip}
        disabled={isRendering || capturedImages.length === 0}
        className={`mt-6 px-5 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold rounded-lg shadow-md ${
          isRendering || capturedImages.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-pink-600 hover:bg-pink-700 text-white"
        }`}
      >
        {isRendering ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          "Download Photo Strip"
        )}
      </button>

      {/* Pesan Error */}
      {errorMessage && (
        <p className="mt-2 text-red-500 text-center font-medium">
          {errorMessage}
        </p>
      )}

      <p className="py-5">
        jika download tidak menampilkan gambar, ulangi proses download kembali 🙏🏻
      </p>
    </div>
  );
}
