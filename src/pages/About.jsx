export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 to-white py-50 px-6">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-5xl font-extrabold text-pink-600 mb-6 drop-shadow-lg">
          Tentang Kami 📸
        </h2>
        <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
          Kami adalah platform photobooth online yang memungkinkan Anda untuk menangkap, menyimpan, dan berbagi momen spesial dengan mudah. 🎉
        </p>

        {/* Keunggulan */}
        <div className="grid gap-6 md:grid-cols-2 text-left">
          <div className="p-6 bg-white rounded-xl shadow-lg flex items-center gap-4 border-2 border-pink-300 hover:shadow-2xl transition">
            <span className="text-4xl text-pink-500">🎥</span>
            <p className="text-lg font-semibold text-gray-800">Akses Kamera Mudah</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg flex items-center gap-4 border-2 border-pink-300 hover:shadow-2xl transition">
            <span className="text-4xl text-pink-500">📷</span>
            <p className="text-lg font-semibold text-gray-800">Ambil Foto Seketika</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg flex items-center gap-4 border-2 border-pink-300 hover:shadow-2xl transition">
            <span className="text-4xl text-pink-500">⬇️</span>
            <p className="text-lg font-semibold text-gray-800">Unduh Hasil Foto</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-lg flex items-center gap-4 border-2 border-pink-300 hover:shadow-2xl transition">
            <span className="text-4xl text-pink-500">🔗</span>
            <p className="text-lg font-semibold text-gray-800">Bagikan ke Media Sosial</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12">
          <a
            href="/capture"
            className="bg-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:bg-pink-600 hover:shadow-xl transition-all duration-300"
          >
            🎬 Coba Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
