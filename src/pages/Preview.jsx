import { useState, useRef } from "react";
import domtoimage from "dom-to-image";

const frameColors = {
  white: "#ffffff",
  black: "#000000",
  pink: "#ff66b2",
  green: "#4caf50",
  yellow: "#ffeb3b",
};

// Stiker bisa berupa URL atau emoji
const stickers = [
  { name: "No Stickers", value: null },
  { name: "🎀 Girlypop", value: "🎀" },
  { name: "🐱 Mofusand", value: "🐱" },
  { name: "💖 Cute", value: "💖" },
];

export default function PhotoStripPreview({ capturedImages = [] }) {
  const [frameColor, setFrameColor] = useState("white");
  const [selectedSticker, setSelectedSticker] = useState(null);
  const stripRef = useRef(null);

  const downloadPhotoStrip = () => {
    if (!stripRef.current) {
      console.error("Elemen tidak ditemukan!");
      return;
    }

    console.log("Menunggu gambar dimuat...");
    setTimeout(() => {
      domtoimage.toBlob(stripRef.current)
        .then((blob) => {
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "photo_strip.png";
          link.click();
          console.log("Photo strip berhasil didownload!");
        })
        .catch((error) => {
          console.error("Gagal membuat screenshot:", error);
        });
    }, 500); // Tunggu 500ms agar semua elemen dimuat
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-pink-300 flex flex-col items-center py-30">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Photo Strip Preview
      </h2>
      <p className="text-gray-700 mb-4">Customize your photo strip</p>

      {/* Frame Color Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(frameColors).map(([color, hex]) => (
          <button
            key={color}
            onClick={() => setFrameColor(color)}
            className={`px-4 py-2 border-2 rounded-md ${
              frameColor === color ? "border-gray-900 bg-gray-300" : "border-gray-400"
            }`}
          >
            {color.charAt(0).toUpperCase() + color.slice(1)}
          </button>
        ))}
      </div>

      {/* Sticker Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {stickers.map((sticker) => (
          <button
            key={sticker.value}
            onClick={() => setSelectedSticker(sticker.value)}
            className={`px-4 py-2 border-2 rounded-md ${
              selectedSticker === sticker.value
                ? "border-gray-900 bg-gray-300"
                : "border-gray-400"
            }`}
          >
            {sticker.name}
          </button>
        ))}
      </div>

      {/* Photo Strip */}
      <div
        ref={stripRef}
        className="p-4 rounded-lg shadow-lg relative flex flex-col items-center"
        style={{
          backgroundColor: frameColors[frameColor],
          width: "320px",
          minHeight: "900px",
          padding: "15px",
        }}
      >
        {capturedImages.map((img, index) => (
          <div key={index} className="relative mb-3 w-full">
            <img
              src={img.imageUrl}
              alt={`Captured ${index + 1}`}
              className="w-full h-48 object-cover rounded-md"
              style={{ filter: img.filter }}
              onLoad={() => console.log(`Gambar ${index + 1} telah dimuat`)}
            />
            {selectedSticker && (
              <div className="absolute inset-0 flex flex-wrap items-center justify-between p-2">
                {[...Array(4)].map((_, i) =>
                  typeof selectedSticker === "string" &&
                  selectedSticker.startsWith("http") ? (
                    <img
                      key={i}
                      src={selectedSticker}
                      alt="Sticker"
                      className="w-8 h-8 opacity-80"
                      style={{
                        position: "absolute",
                        top: i % 2 === 0 ? "10px" : "auto",
                        bottom: i % 2 !== 0 ? "10px" : "auto",
                        left: i < 2 ? "10px" : "auto",
                        right: i >= 2 ? "10px" : "auto",
                      }}
                    />
                  ) : (
                    <span
                      key={i}
                      className="absolute text-lg opacity-80"
                      style={{
                        position: "absolute",
                        top: i % 2 === 0 ? "10px" : "auto",
                        bottom: i % 2 !== 0 ? "10px" : "auto",
                        left: i < 2 ? "10px" : "auto",
                        right: i >= 2 ? "10px" : "auto",
                      }}
                    >
                      {selectedSticker}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        ))}

        {/* Watermark diperbaiki */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-gray-600 text-xs font-semibold opacity-80 whitespace-nowrap">
          © {new Date().getFullYear()} Casofin Photo Booth
        </div>
      </div>

      <button
        onClick={downloadPhotoStrip}
        className="mt-6 px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 shadow-md"
      >
        Download Photo Strip
      </button>
    </div>
  );
}
