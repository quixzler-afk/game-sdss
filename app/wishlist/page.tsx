"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "../../lib/supabase";

import {
  getWishlist,
  removeWishlist,
} from "../../services/wishlist.service";

import { Trash2, Heart } from "lucide-react";

interface WishlistItem {
  id: string;
  user_id: string;
  game_id: number;
  game_name: string;
  image_url: string | null;
  created_at: string;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setItems([]);
        return;
      }

      const result = await getWishlist(user.id);

      if (!result.success) throw result.error;

      setItems((result.data as WishlistItem[]) || []);
    } catch (error) {
      console.error("Wishlist load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    const confirmDelete = confirm("Hapus game dari wishlist?");
    if (!confirmDelete) return;

    const result = await removeWishlist(id);

    if (!result.success) {
      console.error(result.error);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Wishlist
          </h1>

          <p className="text-slate-400 mt-2">
            Saved games for later
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-20 text-slate-400">
            Loading wishlist...
          </div>
        )}

        {/* EMPTY */}
        {!loading && items.length === 0 && (
          <div className="bg-[#111C33] border border-slate-800 rounded-2xl p-10 text-center">
            <Heart className="mx-auto mb-4 text-slate-500" size={48} />

            <h2 className="text-xl font-semibold text-white">
              Wishlist kosong
            </h2>

            <p className="text-slate-400 mt-2">
              Tambahkan game favorit dari Explore
            </p>

            <Link
              href="/explore"
              className="inline-block mt-6 bg-cyan-400 text-black px-6 py-3 rounded-xl font-semibold"
            >
              Explore Games
            </Link>
          </div>
        )}

        {/* GRID */}
        {!loading && items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#111C33] border border-slate-800 rounded-2xl overflow-hidden"
              >
                {/* IMAGE */}
                <div className="relative h-52">
                  <Image
                    src={item.image_url || "/placeholder-game.jpg"}
                    alt={item.game_name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-white font-bold line-clamp-2 min-h-[56px]">
                    {item.game_name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2">
                    Added:{" "}
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </p>

                  {/* ACTION */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/game/${item.game_id}`}
                      className="flex-1 bg-cyan-400 text-black py-2 rounded-lg text-center font-semibold"
                    >
                      Detail
                    </Link>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}