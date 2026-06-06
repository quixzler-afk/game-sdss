"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Gamepad2,
  Trophy,
  BarChart3,
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

      {/* NAVBAR */}
      <nav
        className="
          h-20
          border-b
          border-slate-800
          flex
          items-center
          justify-between
          px-8
        "
      >
        <div className="flex items-center gap-3">
          <Gamepad2
            size={28}
            className="text-cyan-400"
          />

          <h1 className="font-bold text-xl">
            Game Recommendation System
          </h1>
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
                rounded-lg
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
                  rounded-lg
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
                  rounded-lg
                  font-semibold
                "
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section
        className="
          max-w-7xl
          mx-auto
          px-8
          py-24
          text-center
        "
      >
        <div
          className="
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-full
            bg-cyan-400/10
            border
            border-cyan-400/20
            text-cyan-400
            mb-6
          "
        >
          🎮 Decision Support System
        </div>

        <h1
          className="
            text-5xl
            md:text-6xl
            font-bold
            leading-tight
          "
        >
          Temukan Game Terbaik
          <br />
          Dengan
          <span className="text-cyan-400">
            {" "}
            AHP & TOPSIS
          </span>
        </h1>

        <p
          className="
            mt-6
            text-slate-400
            text-lg
            max-w-3xl
            mx-auto
          "
        >
          Sistem rekomendasi game berbasis
          metode AHP dan TOPSIS yang
          membantu pengguna memilih game
          terbaik berdasarkan harga,
          rating, metacritic, popularitas,
          jumlah review, dan tanggal rilis.
        </p>

        <div
          className="
            mt-10
            flex
            justify-center
            gap-4
            flex-wrap
          "
        >
          <button
            onClick={() =>
              router.push(
                loggedIn
                  ? "/dashboard"
                  : "/register"
              )
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
            Mulai Sekarang
            <ArrowRight size={18} />
          </button>

          <button
            onClick={() =>
              router.push("/explore")
            }
            className="
              border
              border-slate-700
              px-6
              py-3
              rounded-xl
            "
          >
            Explore Games
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section
        className="
          max-w-6xl
          mx-auto
          px-8
          pb-24
        "
      >
        <div
          className="
            grid
            md:grid-cols-3
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
              Menentukan bobot setiap
              kriteria berdasarkan
              preferensi pengguna.
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
              Menghasilkan ranking game
              terbaik berdasarkan solusi
              ideal positif dan negatif.
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
            <Gamepad2
              className="text-cyan-400 mb-4"
              size={30}
            />

            <h3 className="font-bold text-xl">
              Real-Time Game Data
            </h3>

            <p className="text-slate-400 mt-3">
              Data game berasal dari RAWG
              dan CheapShark sehingga selalu
              relevan.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}