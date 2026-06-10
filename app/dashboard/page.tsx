"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout";

import {
  getUser,
  getDisplayName,
} from "../../services/auth.service";

import { getDashboardStats } from "../../services/dashboard.service";

import {
  Heart,
  History,
  Gamepad2,
  Trophy,
  Sparkles,
} from "lucide-react";

interface Stats {
  wishlistCount: number;
  historyCount: number;
}

export default function DashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [username, setUsername] =
    useState("Player");

  const [email, setEmail] =
    useState("");

  const [stats, setStats] =
    useState<Stats>({
      wishlistCount: 0,
      historyCount: 0,
    });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard =
    async () => {
      try {
        const user =
          await getUser();

        const displayName =
          await getDisplayName();

        setUsername(
          displayName || "Player"
        );

        if (!user) {
          setLoading(false);
          return;
        }

        setEmail(
          user.email ?? ""
        );

        const dashboardStats =
          await getDashboardStats(
            user.id
          );

        setStats(
          dashboardStats
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-white">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8 text-white">

        {/* HERO */}
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-slate-800
            bg-gradient-to-r
            from-cyan-500/10
            via-slate-900
            to-blue-500/10
            p-8
            mb-8
          "
        >
          <div className="absolute top-0 right-0 opacity-10">
            <Gamepad2 size={250} />
          </div>

          <div className="relative z-10">
            <h1
              className="
                text-4xl
                md:text-5xl
                font-bold
              "
            >
              Welcome,
              <span className="text-cyan-400">
                {" "}
                {username}
              </span>
            </h1>

            <p
              className="
                text-slate-400
                mt-3
                max-w-2xl
              "
            >
              Temukan game terbaik menggunakan
              metode AHP dan TOPSIS berdasarkan
              preferensi yang kamu tentukan.
            </p>

            {email && (
              <p
                className="
                  text-slate-500
                  mt-2
                "
              >
                {email}
              </p>
            )}
          </div>
        </div>

        {/* STATS */}
        <div
          className="
            grid
            md:grid-cols-3
            gap-6
          "
        >
          {/* Wishlist */}
          <div
            className="
              bg-[#111C33]
              border
              border-slate-800
              rounded-2xl
              p-6

              hover:border-cyan-400
              transition
            "
          >
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <div>
                <p className="text-slate-400">
                  Wishlist
                </p>

                <h2
                  className="
                    text-4xl
                    font-bold
                    text-cyan-400
                    mt-2
                  "
                >
                  {stats.wishlistCount}
                </h2>
              </div>

              <Heart
                size={40}
                className="text-cyan-400"
              />
            </div>
          </div>

          {/* History */}
          <div
            className="
              bg-[#111C33]
              border
              border-slate-800
              rounded-2xl
              p-6

              hover:border-cyan-400
              transition
            "
          >
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <div>
                <p className="text-slate-400">
                  Recommendation History
                </p>

                <h2
                  className="
                    text-4xl
                    font-bold
                    text-cyan-400
                    mt-2
                  "
                >
                  {stats.historyCount}
                </h2>
              </div>

              <History
                size={40}
                className="text-cyan-400"
              />
            </div>
          </div>

          {/* Status */}
          <div
            className="
              bg-[#111C33]
              border
              border-slate-800
              rounded-2xl
              p-6

              hover:border-green-400
              transition
            "
          >
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <div>
                <p className="text-slate-400">
                  Account Status
                </p>

                <h2
                  className="
                    text-4xl
                    font-bold
                    text-green-400
                    mt-2
                  "
                >
                  {email
                    ? "Active"
                    : "Visitor"}
                </h2>
              </div>

              <Trophy
                size={40}
                className="text-green-400"
              />
            </div>
          </div>
        </div>

        {/* INFO SECTION */}
        <div
          className="
            mt-8
            grid
            lg:grid-cols-2
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
            <h3
              className="
                text-xl
                font-semibold
                mb-3
              "
            >
              🎮 GameFinder
            </h3>

            <p className="text-slate-400">
              Sistem rekomendasi game berbasis
              AHP dan TOPSIS yang membantu
              pengguna menemukan game terbaik
              berdasarkan genre, platform,
              rating, metacritic, review,
              popularitas, harga, dan tanggal
              rilis.
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
            <h3
              className="
                text-xl
                font-semibold
                mb-3
              "
            >
              🚀 Quick Tips
            </h3>

            <ul
              className="
                space-y-2
                text-slate-400
              "
            >
              <li>
                • Explore untuk mencari game.
              </li>

              <li>
                • Recommendation untuk
                menghasilkan ranking TOPSIS.
              </li>

              <li>
                • Wishlist untuk menyimpan game
                favorit.
              </li>

              <li>
                • History untuk melihat hasil
                rekomendasi sebelumnya.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}