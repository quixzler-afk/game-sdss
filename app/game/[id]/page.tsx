"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "components/DashboardLayout";
import CurrencyText from "components/CurrencyText";

import { supabase } from "lib/supabase";
import { getGameById } from "services/game.service";
import { addWishlist } from "services/wishlist.service";

import { Heart, Star, Trophy, Calendar } from "lucide-react";

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGame();
  }, []);

  const fetchGame = async () => {
    try {
      const data = await getGameById(String(params.id));

      setGame({
        ...data,
        price: Math.floor(Math.random() * 1000000) + 100000,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlist = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // langsung insert wishlist (NO PROFILE CREATE)
      const result = await addWishlist({
        user_id: user.id,
        game_id: game.id,
        game_name: game.name,
        image_url: game.background_image,
      });

      if (result.error) {
        if (result.error.code === "23505") {
          alert("Game sudah ada di wishlist");
          return;
        }

        alert(result.error.message);
        return;
      }

      alert("Berhasil ditambahkan ke wishlist");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-white">Loading...</div>
      </DashboardLayout>
    );
  }

  if (!game) {
    return (
      <DashboardLayout>
        <div className="p-8 text-white">Game tidak ditemukan</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">

        {/* HERO */}
        <div className="relative h-[400px] rounded-3xl overflow-hidden">
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="mt-8">

          {/* TITLE + WISHLIST */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>
              <h1 className="text-4xl font-bold text-white">
                {game.name}
              </h1>

              <div className="flex flex-wrap gap-2 mt-4">
                {game.genres?.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-400"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleWishlist}
              className="bg-cyan-400 text-black px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
            >
              <Heart size={18} />
              Add Wishlist
            </button>
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-4 gap-4 mt-8">

            <div className="bg-[#111C33] p-5 rounded-2xl">
              <Star />
              <p className="mt-2 text-slate-400">Rating</p>
              <h3 className="text-2xl text-white font-bold">
                {game.rating}
              </h3>
            </div>

            <div className="bg-[#111C33] p-5 rounded-2xl">
              <Trophy />
              <p className="mt-2 text-slate-400">Metacritic</p>
              <h3 className="text-2xl text-white font-bold">
                {game.metacritic}
              </h3>
            </div>

            <div className="bg-[#111C33] p-5 rounded-2xl">
              <Calendar />
              <p className="mt-2 text-slate-400">Release</p>
              <h3 className="text-lg text-white font-bold">
                {game.released}
              </h3>
            </div>

            <div className="bg-[#111C33] p-5 rounded-2xl">
              <p className="text-slate-400">Price</p>
              <h3 className="text-xl text-cyan-400 font-bold">
                <CurrencyText value={game.price} />
              </h3>
            </div>

          </div>

          {/* DESCRIPTION */}
          <div className="mt-8 bg-[#111C33] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Description
            </h2>

            <div
              className="text-slate-300 leading-7"
              dangerouslySetInnerHTML={{
                __html: game.description ?? "",
              }}
            />
          </div>

          {/* PLATFORM */}
          <div className="mt-8 bg-[#111C33] rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Platforms
            </h2>

            <div className="flex flex-wrap gap-3">
              {game.parent_platforms?.map((item: any) => (
                <span
                  key={item.platform.id}
                  className="px-4 py-2 bg-[#16213E] rounded-xl text-white"
                >
                  {item.platform.name}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}