export function handleWishlistError(
  error: any
) {
  if (
    error?.message?.includes(
      "wishlist_user_game_unique"
    )
  ) {
    return "Game sudah ada di wishlist";
  }

  return error?.message ??
    "Terjadi kesalahan";
}