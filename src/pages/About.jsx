export default function About() {
  return (
    <div
      className="h-screen w-screen overflow-hidden grid place-items-center bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat px-6 py-20 relative"
    >
      {/* Overlay agar teks tetap terbaca */}
      <div className="absolute inset-0 bg-pink-100/10 backdrop-blur-md"></div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        {/* Header */}
        <h2 className="text-5xl font-extrabold text-pink-600 mb-6 drop-shadow-lg">
          Tentang Kami 📸
        </h2>
        <p className="text-lg text-gray-800 mb-10 max-w-2xl mx-auto leading-relaxed">
          Kami adalah platform photobooth online yang memungkinkan Anda untuk menangkap, menyimpan, dan berbagi momen spesial dengan mudah. 🎉
        </p>

        {/* Keunggulan */}
        <div className="grid gap-6 md:grid-cols-2 text-left">
          {[
            { icon: "🎥", text: "Akses Kamera Mudah" },
            { icon: "📷", text: "Ambil Foto Seketika" },
            { icon: "⬇️", text: "Unduh Hasil Foto" },
            { icon: "🔗", text: "Bagikan ke Media Sosial" },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white/90 rounded-xl shadow-xl flex items-center gap-4 border-2 border-pink-300 hover:shadow-2xl transition-all transform hover:-translate-y-1"
            >
              <span className="text-4xl text-pink-500">{item.icon}</span>
              <p className="text-lg font-semibold text-gray-800">{item.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12">
          <a
            href="/capture"
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition-transform duration-300 flex items-center gap-2 justify-center"
          >
            🎬 Coba Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
