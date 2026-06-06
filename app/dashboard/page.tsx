"use client";

import { useEffect, useState } from "react";

import DashboardLayout from "components/DashboardLayout";

import { getUser } from "../../services/auth.service";

import { getProfile } from "../../services/profile.service";

import { getDashboardStats } from "../../services/dashboard.service";

interface Stats {
  wishlistCount: number;
  historyCount: number;
}

export default function DashboardPage() {
  const [loading, setLoading] =
    useState(true);

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [stats, setStats] =
    useState<Stats>({
      wishlistCount: 0,
      historyCount: 0,
    });

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {
      try {
        const user =
          await getUser();

        if (!user) return;

        setEmail(user.email ?? "");

        const profile =
          await getProfile(
            user.id
          );

        if (profile.data) {
          setUsername(
            profile.data.username ??
              ""
          );
        }

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
      <div className="text-white p-8">
        Loading...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">

        <h1
          className="
            text-4xl
            font-bold
            text-white
          "
        >
          Welcome,
          {" "}
          {username ||
            "Player"}
        </h1>

        <p
          className="
            text-slate-400
            mt-2
          "
        >
          {email}
        </p>

        <div
          className="
            grid
            md:grid-cols-3
            gap-5
            mt-8
          "
        >
          <div
            className="
              bg-[#111C33]
              rounded-2xl
              p-6
            "
          >
            <p className="text-slate-400">
              Wishlist
            </p>

            <h2
              className="
                text-3xl
                text-cyan-400
                font-bold
              "
            >
              {
                stats.wishlistCount
              }
            </h2>
          </div>

          <div
            className="
              bg-[#111C33]
              rounded-2xl
              p-6
            "
          >
            <p className="text-slate-400">
              Recommendation
              History
            </p>

            <h2
              className="
                text-3xl
                text-cyan-400
                font-bold
              "
            >
              {
                stats.historyCount
              }
            </h2>
          </div>

          <div
            className="
              bg-[#111C33]
              rounded-2xl
              p-6
            "
          >
            <p className="text-slate-400">
              Account Status
            </p>

            <h2
              className="
                text-3xl
                text-green-400
                font-bold
              "
            >
              Active
            </h2>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}