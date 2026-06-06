import { ERRORS } from "../constants/errors";

export function isWishlistExists(
  error: any
) {
  return (
    error?.message?.includes(
      ERRORS.WISHLIST_EXISTS
    )
  );
}