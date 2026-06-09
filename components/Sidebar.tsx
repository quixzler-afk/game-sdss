"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Menu,
  LayoutDashboard,
  Gamepad2,
  Trophy,
  Heart,
  History,
  CircleHelp,
  LogOut,
} from "lucide-react";

import { supabase } from "../lib/supabase";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] =
    useState(true);

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Explore",
      icon: Gamepad2,
      path: "/explore",
    },
    {
      name: "Recommendation",
      icon: Trophy,
      path: "/recommendation",
    },
    {
      name: "Wishlist",
      icon: Heart,
      path: "/wishlist",
    },
    {
      name: "History",
      icon: History,
      path: "/history",
    },
    {
      name: "Instruction",
      icon: CircleHelp,
      path: "/instruction",
    },
  ];

  const logout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
  };

  return (
    <aside
      className={`
        sticky
        top-0

        h-screen

        bg-[#0F172A]
        border-r
        border-slate-800

        transition-all
        duration-300

        flex
        flex-col

        ${
          collapsed
            ? "w-16"
            : "w-64"
        }
      `}
    >
      {/* HEADER */}
      <div
        className="
          h-16

          flex
          items-center
          justify-between

          px-4

          border-b
          border-slate-800
        "
      >
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div
              className="
                w-9
                h-9

                rounded-xl

                bg-cyan-400
                text-black

                flex
                items-center
                justify-center
              "
            >
              <Gamepad2 size={18} />
            </div>

            <div>
              <h1
                className="
                  font-bold
                  text-white
                  leading-none
                "
              >
                GameFinder
              </h1>

              <p
                className="
                  text-[10px]
                  text-slate-400
                  mt-1
                "
              >
                AHP + TOPSIS
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="
            text-slate-300

            hover:text-white

            transition
          "
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.path;

          return (
            <button
              key={item.path}
              title={
                collapsed
                  ? item.name
                  : ""
              }
              onClick={() =>
                router.push(item.path)
              }
              className={`
                w-full

                flex
                items-center
                gap-3

                px-5
                py-3

                text-sm

                transition-all

                ${
                  active
                    ? `
                      bg-cyan-400
                      text-black
                      font-semibold
                    `
                    : `
                      text-slate-300
                      hover:bg-slate-800
                      hover:text-white
                    `
                }
              `}
            >
              <Icon size={20} />

              {!collapsed && (
                <span>
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div
        className="
          border-t
          border-slate-800

          p-3
        "
      >
        <button
          onClick={logout}
          title={
            collapsed
              ? "Logout"
              : ""
          }
          className="
            w-full

            flex
            items-center
            gap-3

            p-2

            rounded-lg

            text-red-400

            hover:bg-red-500/10
            hover:text-red-300

            transition
          "
        >
          <LogOut size={20} />

          {!collapsed && (
            <span>
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}