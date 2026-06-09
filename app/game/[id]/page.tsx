"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import DashboardLayout from "../../../components/DashboardLayout";

import { supabase } from "../../../lib/supabase";

import {
  addWishlist,
  removeWishlistByGame,
  isGameWishlisted,
  toggleWishlist,
} from "../../../services/wishlist.service";

import {
  Heart,
  Star,
  Trophy,
  Calendar,
  Monitor,
  Users,
  Gamepad2,
  Tag,
  Building2,
  PlayCircle,
  ShoppingCart,
} from "lucide-react";
import { getGameById } from "services/game.service";

interface GameDetail {
  id: number;

  name: string;

  description_raw: string;

  description?: string;

  background_image: string;

  background_image_additional?: string;

  website?: string;

  rating: number;

  ratings_count: number;

  reviews_count: number;

  metacritic: number;

  released: string;

  playtime: number;

  added: number;

  clip?: {
    clip: string;
  };

  genres: {
    id: number;
    name: string;
  }[];

  tags: {
    id: number;
    name: string;
  }[];

  developers: {
    id: number;
    name: string;
  }[];

  publishers: {
    id: number;
    name: string;
  }[];

  stores: {
    id: number;
    store: {
      id: number;
      name: string;
      domain?: string;
    };
  }[];

  esrb_rating?: {
    id: number;
    name: string;
  };

  parent_platforms: {
    platform: {
      id: number;
      name: string;
    };
  }[];
}

export default function GameDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [game, setGame] = useState<GameDetail | null>(null);

  const [screenshots, setScreenshots] = useState<any[]>([]);

  const [deals, setDeals] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);

  const [wishlisted, setWishlisted] = useState(false);

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    if (!params?.id) return;

    loadPage();
  }, [params?.id]);

  const loadPage = async () => {
    try {
      setLoading(true);

      await Promise.all([fetchGame(), fetchScreenshots()]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGame = async () => {
    try {
      const data = await getGameById(String(params.id));

      setGame(data);

      await fetchDeals(data.name);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const status = await isGameWishlisted(user.id, Number(data.id));

        setWishlisted(status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchScreenshots = async () => {
    try {
      const response = await fetch(`/api/screenshots?id=${game}`);

      if (!response.ok) {
        throw new Error("Failed to fetch screenshots");
      }

      const data = await response.json();

      setScreenshots(data.results || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeals = async (title: string) => {
    try {
      const response = await fetch(
        `/api/deals?title=${encodeURIComponent(title)}`,
      );

      const data = await response.json();

      setDeals(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const checkWishlist = async (gameId: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const result = await isGameWishlisted(user.id, gameId);

      const latestStatus = await isGameWishlisted(user.id, gameId);

      setIsWishlisted(result);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWishlist = async () => {
    if (!game || saving) return;

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Silakan login terlebih dahulu");
        return;
      }

      const result = await toggleWishlist({
        user_id: user.id,
        game_id: game.id,
        game_name: game.name,
        image_url: game.background_image,
      });

      if (!result.success) {
        alert(result.error?.message || "Gagal memperbarui wishlist");
        return;
      }



      // sinkronisasi ulang dengan database
      const latestStatus = await isGameWishlisted(user.id, game.id);

      setIsWishlisted(latestStatus);
    } catch (error) {
      console.error(error);

      alert("Terjadi kesalahan saat mengubah wishlist");
    } finally {
      setSaving(false);
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
      <div className="text-white">
        {/* HERO */}
        <div className="relative h-[500px] md:h-[600px]">
          <Image
            src={game.background_image || "/placeholder-game.jpg"}
            alt={game.name || "Game Cover"}
            fill
            priority
            className="object-cover"
          />

          <div
            className="
      absolute
      inset-0
      bg-gradient-to-t
      from-[#0B1020]
      via-black/70
      to-transparent
    "
          />

          <div
            className="
      absolute
      bottom-0
      left-0
      right-0
      p-6
      md:p-10
    "
          >
            <div
              className="
        flex
        flex-col
        lg:flex-row
        lg:items-end
        lg:justify-between
        gap-6
      "
            >
              <div className="max-w-4xl">
                {/* TITLE */}
                <h1
                  className="
            text-3xl
            md:text-5xl
            font-bold
          "
                >
                  {game.name}
                </h1>

                {/* GENRES */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {game.genres?.map((genre: any, index: number) => (
                    <span
                      key={`${genre.id}-${index}`}
                      className="
                        px-3
                        py-1
                        rounded-full
                        bg-cyan-500/20
                        text-cyan-400
                        text-sm
                      "
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {/* PLATFORMS */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {game.parent_platforms?.map((item: any, index: number) => (
                    <span
                      key={`${item.platform.id}-${index}`}
                      className="
                        px-3
                        py-1
                        rounded-lg
                        bg-slate-800/80
                        text-slate-200
                        text-xs
                      "
                    >
                      {item.platform.name}
                    </span>
                  ))}
                </div>

                {/* QUICK INFO */}
                <div
                  className="
            flex
            flex-wrap
            gap-4
            mt-4
            text-sm
            text-slate-200
          "
                >
                  <span>⭐ Rating: {game.rating ?? "N/A"}</span>

                  <span>🏆 Metacritic: {game.metacritic ?? "N/A"}</span>

                  <span>
                    👥 Reviews: {game.ratings_count?.toLocaleString() ?? "0"}
                  </span>

                  <span>
                    🔥 Popularity: {game.added?.toLocaleString() ?? "0"}
                  </span>
                </div>

                {/* RELEASE */}
                <div className="mt-3 text-slate-300 text-sm">
                  📅 Released:{" "}
                  {game.released
                    ? new Date(game.released).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Unknown"}
                </div>

                {/* PUBLISHER */}
                {game.publishers?.length > 0 && (
                  <div className="mt-2 text-sm text-slate-300">
                    🏢 Publisher:{" "}
                    {game.publishers.map((p: any) => p.name).join(", ")}
                  </div>
                )}

                {/* TAGS */}
                {game.tags?.length > 0 && (
                  <div className="mt-4">
                    <div className="text-xs text-slate-400 mb-2">
                      Popular Tags
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {game.tags
                        ?.slice(0, 10)
                        .map((tag: any, index: number) => (
                          <span
                            key={`${tag.id}-${index}`}
                            className="
                              px-3
                              py-1
                              rounded-full
                              bg-slate-800
                              text-slate-300
                              text-sm
                            "
                          >
                            #{tag.name}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* WISHLIST */}
              <button
                onClick={handleWishlist}
                disabled={saving}
                className="
                  flex
                  items-center
                  gap-3

                  bg-cyan-400
                  text-black

                  px-6
                  py-3

                  rounded-xl

                  font-semibold

                  hover:opacity-90
                  transition

                  disabled:opacity-50
                "
              >
                <Heart
                  size={20}
                  fill={isWishlisted ? "currentColor" : "none"}
                  className={isWishlisted ? "text-red-500" : "text-white"}
                />

                {saving
                  ? "Saving..."
                  : isWishlisted
                    ? "Remove Wishlist"
                    : "Add Wishlist"}
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 md:p-8">
          {/* STATISTICS */}
          <div
            className="
            grid
            grid-cols-2
            lg:grid-cols-4
            gap-4
          "
          >
            {/* USER RATING */}
            <div
              className="
              bg-[#111C33]
              rounded-xl
              p-5
            "
            >
              <Star className="mb-2" size={20} />

              <p className="text-slate-400 text-sm">User Rating</p>

              <h2
                className="
                text-2xl
                font-bold
              "
              >
                {game.rating}
              </h2>
            </div>

            {/* METACRITIC */}
            <div
              className="
              bg-[#111C33]
              rounded-xl
              p-5
            "
            >
              <Trophy className="mb-2" size={20} />

              <p className="text-slate-400 text-sm">Metacritic</p>

              <h2
                className="
                text-2xl
                font-bold
              "
              >
                {game.metacritic ?? "N/A"}
              </h2>
            </div>

            {/* POPULARITY */}
            <div
              className="
              bg-[#111C33]
              rounded-xl
              p-5
            "
            >
              <Gamepad2 className="mb-2" size={20} />

              <p className="text-slate-400 text-sm">Popularity</p>

              <h2
                className="
                text-xl
                font-bold
              "
              >
                {game.added?.toLocaleString()}
              </h2>
            </div>

            {/* REVIEWS */}
            <div
              className="
              bg-[#111C33]
              rounded-xl
              p-5
            "
            >
              <Users className="mb-2" size={20} />

              <p className="text-slate-400 text-sm">Review Count</p>

              <h2
                className="
                text-xl
                font-bold
              "
              >
                {game.reviews_count?.toLocaleString()}
              </h2>
            </div>

            {/* RELEASE */}
            <div
              className="
              bg-[#111C33]
              rounded-xl
              p-5
            "
            >
              <Calendar className="mb-2" size={20} />

              <p className="text-slate-400 text-sm">Release Date</p>

              <h2 className="font-semibold">{formatDate(game.released)}</h2>
            </div>

            {/* PLAYTIME */}
            <div
              className="
              bg-[#111C33]
              rounded-xl
              p-5
            "
            >
              <Gamepad2 className="mb-2" size={20} />

              <p className="text-slate-400 text-sm">Playtime</p>

              <h2 className="font-semibold">{game.playtime} Hours</h2>
            </div>

            {/* ESRB */}
            <div
              className="
              bg-[#111C33]
              rounded-xl
              p-5
            "
            >
              <Tag className="mb-2" size={20} />

              <p className="text-slate-400 text-sm">ESRB Rating</p>

              <h2 className="font-semibold">{game.esrb_rating?.name ?? "-"}</h2>
            </div>

            {/* USER RATINGS */}
            <div
              className="
              bg-[#111C33]
              rounded-xl
              p-5
            "
            >
              <Users className="mb-2" size={20} />

              <p className="text-slate-400 text-sm">User Ratings</p>

              <h2 className="font-semibold">
                {game.ratings_count?.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div
            className="
            mt-8
            bg-[#111C33]
            rounded-2xl
            p-6
          "
          >
            <h2
              className="
              text-2xl
              font-bold
              mb-4
            "
            >
              Description
            </h2>

            <p
              className="
              text-slate-300
              leading-8
              whitespace-pre-line
            "
            >
              {game.description_raw || "No description available."}
            </p>
          </div>

          {/* GAME INFORMATION */}
          <div
            className="
            grid
            lg:grid-cols-2
            gap-6
            mt-8
          "
          >
            {/* PLATFORMS */}
            <div
              className="
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <div className="flex items-center gap-2 mb-4">
                <Monitor size={22} />
                <h2 className="text-xl font-bold">Platforms</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {game.parent_platforms?.map((item) => (
                  <span
                    key={item.platform.id}
                    className="
                      px-3
                      py-2
                      rounded-lg
                      bg-slate-800
                      text-slate-200
                    "
                  >
                    {item.platform.name}
                  </span>
                ))}
              </div>
            </div>

            {/* DEVELOPERS */}
            <div
              className="
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <div className="flex items-center gap-2 mb-4">
                <Gamepad2 size={22} />
                <h2 className="text-xl font-bold">Developers</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {game.developers?.map((dev: any, index: number) => (
                  <span
                    key={`${dev.id}-${index}`}
                    className="
                      px-3
                      py-2
                      rounded-lg
                      bg-slate-800
                      text-cyan-400
                    "
                  >
                    {dev.name}
                  </span>
                ))}
              </div>
            </div>

            {/* PUBLISHERS */}
            <div
              className="
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={22} />
                <h2 className="text-xl font-bold">Publishers</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {game.publishers?.map((publisher: any, index: number) => (
                  <span
                    key={`${publisher.id}-${index}`}
                    className="
                      px-3
                      py-2
                      rounded-lg
                      bg-slate-800
                      text-green-400
                    "
                  >
                    {publisher.name}
                  </span>
                ))}
              </div>
            </div>

            {/* TAGS */}
            <div
              className="
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <div className="flex items-center gap-2 mb-4">
                <Tag size={22} />
                <h2 className="text-xl font-bold">Tags</h2>
              </div>

              <div className="flex flex-wrap gap-2">
                {game.tags?.slice(0, 20).map((tag: any, index: number) => (
                  <span
                    key={`tag-${tag.id}-${index}`}
                    className="
                      px-3
                      py-1
                      rounded-full
                      bg-slate-800
                      text-slate-300
                      text-sm
                    "
                  >
                    #{tag.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* WEBSITE */}
          {game.website && (
            <div
              className="
              mt-8
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <h2
                className="
                text-xl
                font-bold
                mb-4
              "
              >
                Official Website
              </h2>

              <a
                href={game.website}
                target="_blank"
                rel="noopener noreferrer"
                className="
                inline-flex
                items-center
                gap-2

                bg-cyan-400
                text-black

                px-5
                py-3

                rounded-xl
                font-semibold
              "
              >
                Visit Website
              </a>
            </div>
          )}

          {/* TRAILER */}
          {game.clip?.clip && (
            <div
              className="
              mt-8
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <div className="flex items-center gap-2 mb-4">
                <PlayCircle size={24} />
                <h2 className="text-2xl font-bold">Trailer</h2>
              </div>

              <video
                controls
                className="
                w-full
                rounded-xl
              "
                poster={game.background_image}
              >
                <source src={game.clip.clip} type="video/mp4" />
              </video>
            </div>
          )}

          {/* STORES FROM RAWG */}
          {game.stores?.length > 0 && (
            <div
              className="
              mt-8
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={22} />

                <h2 className="text-2xl font-bold">Available Stores</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {game.stores?.map((store: any, index: number) => (
                  <span
                    key={`${store.id}-${index}`}
                    className="
                      px-4
                      py-2
                      rounded-xl
                      bg-slate-800
                      text-cyan-400
                    "
                  >
                    {store.store.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CHEAPSHARK DEALS */}
          {deals.length > 0 && (
            <div
              className="
              mt-8
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <div className="flex items-center gap-2 mb-6">
                <ShoppingCart size={22} />

                <h2 className="text-2xl font-bold">Best Deals</h2>
              </div>

              <div className="space-y-4">
                {deals.slice(0, 3).map((deal: any, index: number) => {
                  const retail = Number(deal.normalPrice || 0);

                  const sale = Number(deal.salePrice || 0);

                  const discount = Number(deal.savings || 0);

                  const retailIDR = retail * 16500;

                  const saleIDR = sale * 16500;

                  return (
                    <div
                      key={`${deal.dealID}-${index}`}
                      className="
                        border
                        border-slate-700
                        rounded-xl
                        p-4
                      "
                    >
                      <div
                        className="
                          flex
                          flex-col
                          lg:flex-row
                          lg:items-center
                          lg:justify-between
                          gap-4
                        "
                      >
                        {/* LEFT */}
                        <div>
                          <h3
                            className="
                              font-semibold
                              text-lg
                            "
                          >
                            {deal.storeName}
                          </h3>

                          <div
                            className="
                              mt-2
                              space-y-1
                              text-sm
                              text-slate-300
                            "
                          >
                            <p>
                              Retail Price:{" "}
                              <span className="line-through text-red-400">
                                {formatRupiah(retailIDR)}
                              </span>
                            </p>

                            <p>
                              Sale Price:{" "}
                              <span className="text-green-400 font-semibold">
                                {formatRupiah(saleIDR)}
                              </span>
                            </p>

                            <p>
                              Discount:{" "}
                              <span className="text-cyan-400">
                                {discount.toFixed(0)}%
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* RIGHT */}
                        <a
                          href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="
                            bg-cyan-400
                            text-black
                            px-5
                            py-3
                            rounded-xl
                            font-semibold
                            text-center
                          "
                        >
                          Open Deal
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NO DEALS */}
          {deals.length === 0 && (
            <div
              className="
              mt-8
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <h2
                className="
                text-xl
                font-bold
                mb-2
              "
              >
                Best Deals
              </h2>

              <p className="text-slate-400">
                No CheapShark deals found for this game.
              </p>
            </div>
          )}

          {/* ADDITIONAL BACKGROUND */}
          {game.background_image_additional && (
            <div
              className="
              mt-8
              bg-[#111C33]
              rounded-2xl
              p-6
            "
            >
              <h2
                className="
                text-2xl
                font-bold
                mb-5
              "
              >
                Additional Artwork
              </h2>

              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={
                    game.background_image_additional ||
                    game.background_image ||
                    "/placeholder-game.jpg"
                  }
                  alt={`${game.name || "Game"} Additional Image`}
                  width={1600}
                  height={900}
                  className="
                    w-full
                    object-cover
                    "
                />
              </div>
            </div>
          )}

          {/* GAME SUMMARY */}
          <div
            className="
            mt-8
            bg-[#111C33]
            rounded-2xl
            p-6
          "
          >
            <h2
              className="
              text-2xl
              font-bold
              mb-4
            "
            >
              Game Summary
            </h2>

            <div
              className="
              grid
              md:grid-cols-2
              gap-4
              text-slate-300
            "
            >
              <div>
                <span className="font-semibold text-white">Genres:</span>{" "}
                {game.genres?.map((g) => g.name).join(", ")}
              </div>

              <div>
                <span className="font-semibold text-white">Platforms:</span>{" "}
                {game.parent_platforms?.map((p) => p.platform.name).join(", ")}
              </div>

              <div>
                <span className="font-semibold text-white">Developers:</span>{" "}
                {game.developers?.map((d) => d.name).join(", ")}
              </div>

              <div>
                <span className="font-semibold text-white">Publishers:</span>{" "}
                {game.publishers?.map((p) => p.name).join(", ")}
              </div>

              <div>
                <span className="font-semibold text-white">Release Date:</span>{" "}
                {formatDate(game.released)}
              </div>

              <div>
                <span className="font-semibold text-white">ESRB:</span>{" "}
                {game.esrb_rating?.name ?? "-"}
              </div>

              <div>
                <span className="font-semibold text-white">Metacritic:</span>{" "}
                {game.metacritic ?? "-"}
              </div>

              <div>
                <span className="font-semibold text-white">User Rating:</span>{" "}
                {game.rating}
              </div>

              <div>
                <span className="font-semibold text-white">Reviews:</span>{" "}
                {game.reviews_count?.toLocaleString()}
              </div>

              <div>
                <span className="font-semibold text-white">Popularity:</span>{" "}
                {game.added?.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
