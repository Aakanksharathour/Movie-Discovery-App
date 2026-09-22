import axiosClient from './axiosClient';
import getGuestId from '../utils/getGuestId';

function guestHeaders() {
  return {
    'X-Guest-Id': getGuestId(),
  };
}

async function fetchWishlist(options = {}) {
  const response = await axiosClient.get('/wishlist', {
    headers: guestHeaders(),
    signal: options.signal,
  });
  return response.data;
}

async function addWishlistItem(movie) {
  const response = await axiosClient.post(
    '/wishlist',
    {
      guestId: getGuestId(),
      movieId: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl || null,
      releaseYear: movie.releaseYear || null,
      rating: movie.rating ?? null,
    },
    {
      headers: guestHeaders(),
    }
  );
  return response.data;
}

async function removeWishlistItem(movieId) {
  const response = await axiosClient.delete(`/wishlist/${movieId}`, {
    headers: guestHeaders(),
    params: { guestId: getGuestId() },
  });
  return response.data;
}

export { fetchWishlist, addWishlistItem, removeWishlistItem };
