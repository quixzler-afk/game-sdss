"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import DashboardLayout from "../../components/DashboardLayout";
import { supabase } from "../../lib/supabase";

import { getWishlist, removeWishlist } from "../../services/wishlist.service";

import { Trash2, Heart } from "lucide-react";

interface WishlistItem {
  id: string;
  user_id: string;
  game_id: number;
  game_name: string;
  image_url: string | null;
  created_at: string;
}

interface WishlistGame extends WishlistItem {
  genre?: string;
  platform?: string;
  rating?: number;
  metacritic?: number;
  popularity?: number;
  reviewCount?: number;
  released?: string;
  store?: string;

  retailPrice?: number;
  salePrice?: number;
  discount?: number;
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWishlist();
  }, []);

  const formatRupiah = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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

      const wishlist = (result.data as WishlistItem[]) || [];

      const detailedGames = await Promise.all(
        wishlist.map(async (item) => {
          try {
            const res = await fetch(`/api/games/${item.game_id}`);

            const game = await res.json();

            const retailPrice = Math.floor(Math.random() * 900000) + 100000;

            const discount = Math.floor(Math.random() * 70);

            const salePrice =
              retailPrice - Math.floor(retailPrice * (discount / 100));

            return {
              ...item,

              genre:
                game.genres
                  ?.map((g: any) => g.name)
                  .slice(0, 2)
                  .join(", ") || "-",

              platform:
                game.parent_platforms
                  ?.map((p: any) => p.platform.name)
                  .slice(0, 3)
                  .join(", ") || "-",

              rating: game.rating ?? 0,

              metacritic: game.metacritic ?? 0,

              popularity: game.added ?? 0,

              reviewCount: game.ratings_count ?? 0,

              released: game.released ?? "-",

              store: game.stores?.[0]?.store?.name ?? "Steam",

              retailPrice,
              salePrice,
              discount,
            };
          } catch {
            return item;
          }
        }),
      );

      setItems(detailedGames);
    } catch (error) {
      console.error(error);
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Wishlist</h1>

          <p className="text-slate-400 mt-2">Saved games for later</p>
        </div>

        {loading && (
          <div className="text-center py-20 text-slate-400">
            Loading wishlist...
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="bg-[#111C33] border border-slate-800 rounded-2xl p-10 text-center">
            <Heart size={48} className="mx-auto mb-4 text-slate-500" />

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

        {!loading && items.length > 0 && (
          <div className="space-y-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#111C33] border border-slate-800 rounded-2xl p-4"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-52 h-32 rounded-xl overflow-hidden">
                    <Image
                      src={item.image_url || "/placeholder-game.jpg"}
                      alt={item.game_name || "Wishlist Game"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">
                      {item.game_name}
                    </h3>

                    <div className="mt-3 grid md:grid-cols-2 gap-2 text-sm text-slate-300">
                      <p>🎮 Genre: {item.genre}</p>

                      <p>🖥️ Platform: {item.platform}</p>

                      <p>⭐ Rating: {item.rating}</p>

                      <p>🏆 Metacritic: {item.metacritic}</p>

                      <p>🔥 Popularity: {item.popularity?.toLocaleString()}</p>

                      <p>📝 Reviews: {item.reviewCount?.toLocaleString()}</p>

                      <p>
                        📅 Release Date:{" "}
                        {item.released ? formatDate(item.released) : "-"}
                      </p>

                      <p>🏪 Store: {item.store}</p>

                      <p>
                        💰 Retail Price: {formatRupiah(item.retailPrice || 0)}
                      </p>

                      <p>🏷️ Sale Price: {formatRupiah(item.salePrice || 0)}</p>

                      <p>🎯 Discount: {item.discount}%</p>

                      <p className="text-cyan-400 font-semibold">
                        Added: {formatDate(item.created_at)}
                      </p>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <Link
                        href={`/game/${item.game_id}`}
                        className="bg-cyan-400 text-black px-5 py-2 rounded-lg font-semibold"
                      >
                        Game Detail
                      </Link>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
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
