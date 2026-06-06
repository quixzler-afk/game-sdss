import {
  LayoutDashboard,
  Search,
  Sparkles,
  Heart,
  History,
} from "lucide-react";

export const sidebarMenu = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Explore",
    href: "/explore",
    icon: Search,
  },

  {
    label: "Recommendation",
    href: "/recommendation",
    icon: Sparkles,
  },

  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },

  {
    label: "History",
    href: "/history",
    icon: History,
  },
];