"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Gamepad2,
  Trophy,
  BarChart3,
  Database,
  CircleHelp,
  Star,
  Sparkles,
} from "lucide-react";

import { supabase } from "lib/supabase";

export default function HomePage() {
  const router = useRouter();

  const [loggedIn, setLoggedIn] =
    useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setLoggedIn(!!session);
  };

  return (
    <main className="min-h-screen bg-[#0B1020] text-white">

      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}
      <nav
        className="
          sticky
          top-0
          z-50

          h-20

          backdrop-blur-md
          bg-[#0B1020]/90

          border-b
          border-slate-800

          flex
          items-center
          justify-between

          px-6
          md:px-10
        "
      >
        <div className="flex items-center gap-3">

          <div
            className="
              w-10
              h-10

              rounded-xl

              bg-cyan-400
              text-black

              flex
              items-center
              justify-center

              font-bold
            "
          >
            G
          </div>

          <div>
            <h1 className="font-bold text-xl">
              GameFinder
            </h1>

            <p className="text-xs text-slate-400">
              AHP + TOPSIS DSS
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {loggedIn ? (
            <button
              onClick={() =>
                router.push("/dashboard")
              }
              className="
                bg-cyan-400
                text-black

                px-5
                py-2

                rounded-xl

                font-semibold
              "
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() =>
                  router.push("/login")
                }
                className="
                  border
                  border-slate-700

                  px-5
                  py-2

                  rounded-xl
                "
              >
                Login
              </button>

              <button
                onClick={() =>
                  router.push("/register")
                }
                className="
                  bg-cyan-400
                  text-black

                  px-5
                  py-2

                  rounded-xl

                  font-semibold
                "
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}
      <section
        className="
          max-w-7xl
          mx-auto

          px-6
          md:px-10

          py-24
          text-center
        "
      >
        
        <h1
          className="
            text-5xl
            md:text-7xl

            font-bold

            mt-8
            leading-tight
          "
        >
          Temukan Game Terbaik
          <br />

          Dengan Metode

          <span className="text-cyan-400">
            {" "}
            AHP & TOPSIS
          </span>
        </h1>

        <p
          className="
            mt-8

            text-lg
            text-slate-400

            max-w-4xl
            mx-auto

            leading-8
          "
        >
          GameFinder merupakan Sistem Pendukung Keputusan
          (SPK) yang membantu pengguna menemukan game
          terbaik berdasarkan preferensi pribadi menggunakan
          metode Analytical Hierarchy Process (AHP)
          dan Technique for Order Preference by Similarity to
          Ideal Solution (TOPSIS).
        </p>

        <div
          className="
            flex
            justify-center
            gap-4
            flex-wrap

            mt-10
          "
        >
          <button
            onClick={() =>
              router.push("/recommendation")
            }
            className="
              flex
              items-center
              gap-2

              bg-cyan-400
              text-black

              px-6
              py-3

              rounded-xl

              font-semibold
            "
          >
            Generate Recommendation
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() =>
              router.push("/instruction")
            }
            className="
              flex
              items-center
              gap-2

              border
              border-slate-700

              px-6
              py-3

              rounded-xl
            "
          >
            <CircleHelp size={18} />
            How It Works
          </button>
        </div>
      </section>

      {/* ========================= */}
      {/* CRITERIA */}
      {/* ========================= */}
      <section
        className="
          max-w-7xl
          mx-auto

          px-6
          md:px-10

          pb-16
        "
      >
        <h2
          className="
            text-3xl
            font-bold
            text-center
            mb-10
          "
        >
          Kriteria Evaluasi Game
        </h2>

        <div
          className="
            grid
            md:grid-cols-3
            lg:grid-cols-6
            gap-4
          "
        >
          {[
            "Price",
            "Metacritic",
            "Popularity",
            "User Rating",
            "Review Count",
            "Release Date",
          ].map((item) => (
            <div
              key={item}
              className="
                bg-[#111C33]
                border
                border-slate-800

                rounded-2xl

                p-5

                text-center
              "
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* ========================= */}
      {/* FEATURES */}
      {/* ========================= */}
      <section
        className="
          max-w-7xl
          mx-auto

          px-6
          md:px-10

          pb-24
        "
      >
        <h2
          className="
            text-3xl
            font-bold
            text-center

            mb-10
          "
        >
          Fitur Utama
        </h2>

        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-4

            gap-6
          "
        >
          <div
            className="
              bg-[#111C33]
              border
              border-slate-800

              rounded-2xl
              p-6
            "
          >
            <Trophy
              className="text-cyan-400 mb-4"
              size={30}
            />

            <h3 className="font-bold text-xl">
              AHP Weighting
            </h3>

            <p className="text-slate-400 mt-3">
              Menentukan bobot setiap kriteria
              berdasarkan preferensi pengguna.
            </p>
          </div>

          <div
            className="
              bg-[#111C33]
              border
              border-slate-800

              rounded-2xl
              p-6
            "
          >
            <BarChart3
              className="text-cyan-400 mb-4"
              size={30}
            />

            <h3 className="font-bold text-xl">
              TOPSIS Ranking
            </h3>

            <p className="text-slate-400 mt-3">
              Menghasilkan ranking alternatif
              terbaik berdasarkan solusi ideal.
            </p>
          </div>

          <div
            className="
              bg-[#111C33]
              border
              border-slate-800

              rounded-2xl
              p-6
            "
          >
            <Database
              className="text-cyan-400 mb-4"
              size={30}
            />

            <h3 className="font-bold text-xl">
              RAWG Database
            </h3>

            <p className="text-slate-400 mt-3">
              Ribuan data game, genre,
              platform, publisher, rating,
              dan metacritic.
            </p>
          </div>

          <div
            className="
              bg-[#111C33]
              border
              border-slate-800

              rounded-2xl
              p-6
            "
          >
            <Sparkles
              className="text-cyan-400 mb-4"
              size={30}
            />

            <h3 className="font-bold text-xl">
              CheapShark Deals
            </h3>

            <p className="text-slate-400 mt-3">
              Menampilkan harga game,
              diskon, dan store termurah
              secara real-time.
            </p>
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* WORKFLOW */}
      {/* ========================= */}
      <section
        className="
          bg-[#111C33]
          border-t
          border-slate-800
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto

            px-6
            md:px-10

            py-20
          "
        >
          <h2
            className="
              text-3xl
              font-bold
              text-center

              mb-12
            "
          >
            Cara Kerja Sistem
          </h2>

          <div
            className="
              grid
              md:grid-cols-4
              gap-6
            "
          >
            {[
              "Input Preferensi",
              "Hitung Bobot AHP",
              "Ranking TOPSIS",
              "Rekomendasi Game",
            ].map((step, index) => (
              <div
                key={step}
                className="
                  text-center
                "
              >
                <div
                  className="
                    w-14
                    h-14

                    mx-auto
                    mb-4

                    rounded-full

                    bg-cyan-400
                    text-black

                    flex
                    items-center
                    justify-center

                    font-bold
                    text-lg
                  "
                >
                  {index + 1}
                </div>

                <h3 className="font-semibold">
                  {step}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= */}
      {/* FOOTER */}
      {/* ========================= */}
      <footer
        className="
          border-t
          border-slate-800

          py-8

          text-center
          text-slate-500
        "
      >
        <p>
          GameFinder © 2026
        </p>

        <p className="mt-2 text-sm">
          Decision Support System Using
          AHP & TOPSIS
        </p>
      </footer>
    </main>
  );
}