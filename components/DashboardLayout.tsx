"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

import { sidebarMenu } from "../constants/sidebar-menu";
import { logout } from "../services/auth.service";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] =
    useState(true);

  const handleLogout =
    async () => {
      try {
        await logout();
        router.push("/login");
      } catch (error) {
        console.error(
          "Logout error:",
          error
        );
      }
    };

  return (
    <div className="min-h-screen flex bg-[#0B1020] text-white">

      {/* SIDEBAR */}
      <aside
        className={`
          ${
            collapsed
              ? "w-16"
              : "w-64"
          }

          sticky
          top-0
          h-screen

          bg-[#111C33]
          border-r
          border-slate-800

          transition-all
          duration-300

          overflow-y-auto
        `}
      >
        {/* HEADER */}
        <div
          className="
            h-16
            px-4

            flex
            items-center
            justify-between

            border-b
            border-slate-800
          "
        >
          {!collapsed && (
            <h1 className="font-bold text-lg">
              Game SDSS
            </h1>
          )}

          <button
            onClick={() =>
              setCollapsed(
                !collapsed
              )
            }
            className="
              p-1
              rounded
              hover:bg-[#16213E]
            "
          >
            {collapsed ? (
              <ChevronRight
                size={20}
              />
            ) : (
              <ChevronLeft
                size={20}
              />
            )}
          </button>
        </div>

        {/* MENU + LOGOUT */}
        <div className="p-2">

          {sidebarMenu.map(
            (item) => {
              const Icon =
                item.icon;

              const active =
                pathname ===
                item.href;

              return (
                <Link
                  key={
                    item.href
                  }
                  href={
                    item.href
                  }
                  className={`
                    flex
                    items-center
                    gap-3

                    p-3
                    mb-2

                    rounded-xl
                    transition

                    ${
                      active
                        ? "bg-cyan-400 text-black"
                        : "hover:bg-[#16213E]"
                    }
                  `}
                >
                  <Icon
                    size={20}
                  />

                  {!collapsed && (
                    <span>
                      {
                        item.label
                      }
                    </span>
                  )}
                </Link>
              );
            }
          )}

          {/* LOGOUT */}
          <button
            onClick={
              handleLogout
            }
            className="
              w-full

              flex
              items-center
              gap-3

              p-3
              mt-4

              rounded-xl

              hover:bg-red-500/20
              text-red-400

              transition
            "
          >
            <LogOut
              size={20}
            />

            {!collapsed && (
              <span>
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main
        className="
          flex-1
          overflow-y-auto
        "
      >
        {children}
      </main>
    </div>
  );
}