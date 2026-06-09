"use client";

import DashboardLayout from "../../components/DashboardLayout";

export default function InstructionPage() {
  return (
    <DashboardLayout>
      <div className="p-8 max-w-7xl mx-auto text-white">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            User Guide & Methodology
          </h1>

          <p className="text-slate-400 mt-3">
            Penjelasan lengkap cara kerja sistem rekomendasi game
            menggunakan metode AHP dan TOPSIS.
          </p>
        </div>

        {/* ===================================================== */}
        {/* TUJUAN */}
        {/* ===================================================== */}
        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            1. Tujuan Sistem
          </h2>

          <p className="text-slate-300 leading-8">
            GameFinder merupakan Sistem Pendukung Keputusan
            (SPK) yang membantu pengguna memilih game terbaik
            berdasarkan preferensi masing-masing pengguna.
          </p>

          <p className="text-slate-300 leading-8 mt-4">
            Sistem menggunakan:
          </p>

          <ul className="list-disc ml-6 mt-3 space-y-2 text-slate-300">
            <li>
              AHP (Analytical Hierarchy Process)
              untuk menentukan bobot kriteria.
            </li>

            <li>
              TOPSIS (Technique for Order Preference by Similarity
              to Ideal Solution) untuk menentukan ranking game.
            </li>
          </ul>
        </section>

        {/* ===================================================== */}
        {/* DATA */}
        {/* ===================================================== */}
        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            2. Sumber Data
          </h2>

          <div className="space-y-4 text-slate-300">
            <p>
              Sistem mengambil data dari dua sumber:
            </p>

            <div className="bg-[#0B1020] p-4 rounded-xl">
              <h3 className="font-semibold text-cyan-400">
                RAWG API
              </h3>

              <p className="mt-2">
                Digunakan untuk memperoleh:
              </p>

              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Nama Game</li>
                <li>Genre</li>
                <li>Platform</li>
                <li>Metacritic Score</li>
                <li>Rating</li>
                <li>Review Count</li>
                <li>Popularity</li>
                <li>Release Date</li>
              </ul>
            </div>

            <div className="bg-[#0B1020] p-4 rounded-xl">
              <h3 className="font-semibold text-cyan-400">
                CheapShark API
              </h3>

              <p className="mt-2">
                Digunakan untuk memperoleh:
              </p>

              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Harga Retail</li>
                <li>Harga Sale</li>
                <li>Diskon</li>
                <li>Store Penjual</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* KRITERIA */}
        {/* ===================================================== */}
        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-5">
            3. Kriteria Keputusan
          </h2>

          <div className="overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-3">Kode</th>
                  <th>Kriteria</th>
                  <th>Tipe</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="py-3">C1</td>
                  <td>Price</td>
                  <td>Cost</td>
                </tr>

                <tr>
                  <td className="py-3">C2</td>
                  <td>Metacritic Score</td>
                  <td>Benefit</td>
                </tr>

                <tr>
                  <td className="py-3">C3</td>
                  <td>Popularity</td>
                  <td>Benefit</td>
                </tr>

                <tr>
                  <td className="py-3">C4</td>
                  <td>User Rating</td>
                  <td>Benefit</td>
                </tr>

                <tr>
                  <td className="py-3">C5</td>
                  <td>Review Count</td>
                  <td>Benefit</td>
                </tr>

                <tr>
                  <td className="py-3">C6</td>
                  <td>Release Date</td>
                  <td>Benefit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ===================================================== */}
        {/* AHP */}
        {/* ===================================================== */}
        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            4. Perhitungan Bobot AHP
          </h2>

          <p className="text-slate-300 leading-8">
            Pengguna menentukan tingkat kepentingan setiap
            kriteria menggunakan slider.
          </p>

          <p className="text-slate-300 leading-8 mt-4">
            Contoh:
          </p>

          <div className="bg-[#0B1020] rounded-xl p-5 mt-3">
            <pre className="text-cyan-400">
{`Price          = 20
Metacritic     = 90
Popularity     = 80
Rating         = 100
Review Count   = 60
Release Date   = 50`}
            </pre>
          </div>

          <p className="mt-5 text-slate-300">
            Total seluruh nilai:
          </p>

          <div className="bg-[#0B1020] rounded-xl p-4 mt-3">
            Total = 20 + 90 + 80 + 100 + 60 + 50 = 400
          </div>

          <p className="mt-5 text-slate-300">
            Bobot dihitung:
          </p>

          <div className="bg-[#0B1020] rounded-xl p-5 mt-3">
            <pre>
{`Wi = Xi / ΣX`}
            </pre>
          </div>

          <p className="mt-5 text-slate-300">
            Contoh:
          </p>

          <div className="bg-[#0B1020] rounded-xl p-5 mt-3">
            <pre>
{`Wprice = 20/400 = 0.05
Wmeta  = 90/400 = 0.225
Wrating = 100/400 = 0.25`}
            </pre>
          </div>
        </section>

        {/* ===================================================== */}
        {/* TOPSIS */}
        {/* ===================================================== */}
        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            5. Pembentukan Matriks Keputusan
          </h2>

          <p className="text-slate-300 leading-8">
            Setiap game menjadi alternatif.
          </p>

          <div className="bg-[#0B1020] rounded-xl p-5 mt-4 overflow-auto">
            <pre>
{`          C1    C2    C3    C4
Game A    100   85    70    4.5
Game B    200   90    90    4.7
Game C    150   80    95    4.3`}
            </pre>
          </div>
        </section>

        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            6. Normalisasi TOPSIS
          </h2>

          <div className="bg-[#0B1020] rounded-xl p-5 mt-4">
            <pre>
{`rij = xij / √Σ(xij²)`}
            </pre>
          </div>

          <p className="mt-4 text-slate-300">
            Semua nilai kriteria dinormalisasi agar dapat
            dibandingkan secara adil.
          </p>
        </section>

        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            7. Matriks Normalisasi Terbobot
          </h2>

          <div className="bg-[#0B1020] rounded-xl p-5 mt-4">
            <pre>
{`vij = rij × wj`}
            </pre>
          </div>
        </section>

        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            8. Solusi Ideal Positif & Negatif
          </h2>

          <div className="space-y-4 text-slate-300">
            <p>
              A⁺ = nilai terbaik setiap kriteria
            </p>

            <p>
              A⁻ = nilai terburuk setiap kriteria
            </p>

            <p>
              Untuk Cost (Price):
              nilai terkecil menjadi ideal positif.
            </p>

            <p>
              Untuk Benefit:
              nilai terbesar menjadi ideal positif.
            </p>
          </div>
        </section>

        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            9. Menghitung Jarak Solusi Ideal
          </h2>

          <div className="bg-[#0B1020] rounded-xl p-5 mt-4">
            <pre>
{`D+ = √Σ(vij - A+)²

D- = √Σ(vij - A-)²`}
            </pre>
          </div>
        </section>

        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
            mb-8
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            10. Nilai Preferensi TOPSIS
          </h2>

          <div className="bg-[#0B1020] rounded-xl p-5 mt-4">
            <pre>
{`Vi = D- / (D+ + D-)`}
            </pre>
          </div>

          <p className="mt-4 text-slate-300">
            Nilai Vi mendekati 1 berarti game semakin baik
            dan lebih direkomendasikan.
          </p>
        </section>

        {/* ===================================================== */}
        {/* HASIL */}
        {/* ===================================================== */}
        <section
          className="
            bg-[#111C33]
            border
            border-slate-800
            rounded-2xl
            p-6
          "
        >
          <h2 className="text-2xl font-bold mb-4">
            11. Interpretasi Hasil
          </h2>

          <ul className="space-y-3 text-slate-300">
            <li>
              Nilai TOPSIS tertinggi = Ranking 1
            </li>

            <li>
              Ranking 1 merupakan rekomendasi terbaik.
            </li>

            <li>
              Semakin tinggi skor TOPSIS maka game semakin
              sesuai dengan preferensi pengguna.
            </li>

            <li>
              Alasan rekomendasi ditampilkan berdasarkan
              kontribusi kriteria dengan bobot terbesar.
            </li>
          </ul>
        </section>

      </div>
    </DashboardLayout>
  );
}