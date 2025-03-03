import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCameraRetro } from "react-icons/fa";

export default function Home() {
  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center 
      bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat text-black px-4 sm:px-6 pt-20"
    >
      <div className="flex flex-col items-center text-center max-w-xs sm:max-w-md md:max-w-lg bg-pink-100/60 p-6 rounded-xl shadow-lg">
        {/* Header */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wider text-pink-900 drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          casobooth
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-gray-800 mt-4 leading-relaxed px-2 sm:px-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Casobooth adalah bagian dari Casofin, tempat kamu bebas berekspresi!
          Abadikan momen terbaik dan tunjukkan kreativitasmu di sini! 🚀✨
        </motion.p>

        {/* Foto Strip */}
        <motion.div
          className="w-48 sm:w-56 md:w-64 border border-gray-300 shadow-xl rounded-xl overflow-hidden my-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <img src="/ilustrasi.jpg" alt="Photo Strip" className="w-full" />
        </motion.div>

        {/* Tombol Mulai */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Link
            to="/capture"
            className="px-6 sm:px-10 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 text-lg sm:text-xl font-semibold border-2 border-black rounded-full bg-pink-400 text-white hover:bg-pink-500 transition-all shadow-lg hover:shadow-2xl"
          >
            <FaCameraRetro className="text-xl sm:text-2xl" /> MULAI EKSPRESI
          </Link>
        </motion.div>

        {/* Footer */}
        <footer className="mt-6 text-xs sm:text-sm text-gray-600">
          <p className="mb-2">
            Part of{" "}
            <a
              href="http://casofin.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-300 px-2 py-1 rounded-md font-medium hover:bg-pink-400 transition-all"
            >
              casofin
            </a>
          </p>
          <p>© {new Date().getFullYear()} Casobooth. Spread your vibes ✨</p>
        </footer>
      </div>
    </div>
  );
}
