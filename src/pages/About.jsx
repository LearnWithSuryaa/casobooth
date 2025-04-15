import React from "react";
import { motion } from "framer-motion";
import {
  Video,
  Camera,
  ImageDown,
  Share2,
} from "lucide-react";

export default function About() {
  const features = [
    { icon: <Video className="w-8 h-8 text-pink-500" />, text: "Akses Kamera Mudah" },
    { icon: <Camera className="w-8 h-8 text-pink-500" />, text: "Ambil Foto Seketika" },
    { icon: <ImageDown className="w-8 h-8 text-pink-500" />, text: "Unduh Hasil Foto" },
    { icon: <Share2 className="w-8 h-8 text-pink-500" />, text: "Bagikan ke Media Sosial" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat px-6 py-20">
      {/* Overlay transparan dan blur */}
      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-sm z-0"></div>

      {/* Konten Utama */}
      <div className="relative z-10 max-w-5xl mx-auto text-center py-25">
        {/* Judul */}
        <motion.h2
          className="text-5xl font-extrabold text-pink-600 mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Tentang Kami
        </motion.h2>

        {/* Deskripsi */}
        <motion.p
          className="text-lg text-gray-800 mb-12 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Kami adalah platform photobooth online yang memungkinkan Anda untuk menangkap, menyimpan, dan berbagi momen spesial dengan mudah.
        </motion.p>

        {/* Fitur Utama */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((item, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white/90 rounded-2xl shadow-xl flex items-center gap-4 border-2 border-pink-300 hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 transition-all duration-300"
              whileHover={{ rotate: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 * index }}
            >
              <div>{item.icon}</div>
              <p className="text-lg font-semibold text-gray-800">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          className="mt-16"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
        >
          <a
            href="/capture"
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2 justify-center"
          >
            <Camera className="w-5 h-5" />
            Coba Sekarang
          </a>
        </motion.div>
      </div>
    </div>
  );
}
