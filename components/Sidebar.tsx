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
  LogOut,
} from "lucide-react";

import { supabase } from "../lib/supabase";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(true);

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
  ];

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside
      className={`
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
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <h1 className="font-bold text-white">
            Game SPK
          </h1>
        )}

        <button
          onClick={() =>
            setCollapsed(!collapsed)
          }
          className="text-slate-300"
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
                transition
                text-sm

                ${
                  active
                    ? "bg-cyan-400 text-black"
                    : "text-slate-300 hover:bg-slate-800"
                }
              `}
            >
              <Icon size={20} />

              {!collapsed && (
                <span>{item.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-slate-800 p-3">
        <button
          onClick={logout}
          className="
            flex
            items-center
            gap-3
            text-red-400
            hover:bg-slate-800
            p-2
            rounded-lg
            w-full
          "
        >
          <LogOut size={20} />

          {!collapsed && (
            <span>Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}