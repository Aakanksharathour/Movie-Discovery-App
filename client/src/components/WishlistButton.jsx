import { useEffect, useState } from 'react';
import {
  addWishlistItem,
  fetchWishlist,
  removeWishlistItem,
} from '../api/wishlistApi';

/**
 * Toggle button: add/remove a movie from the persistent wishlist.
 */
function WishlistButton({ movie }) {
  const [inWishlist, setInWishlist] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function checkWishlist() {
      try {
        const data = await fetchWishlist();
        const results = data.results || [];
        let found = false;
        for (let i = 0; i < results.length; i++) {
          if (results[i].movieId === movie.id) {
            found = true;
            break;
          }
        }
        if (!cancelled) {
          setInWishlist(found);
        }
      } catch {
        // Non-blocking — details page still works if wishlist check fails
      }
    }

    if (movie?.id) {
      checkWishlist();
    }

    return () => {
      cancelled = true;
    };
  }, [movie?.id]);

  async function handleClick() {
    if (!movie?.id || busy) {
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      if (inWishlist) {
        await removeWishlistItem(movie.id);
        setInWishlist(false);
        setMessage('Removed from wishlist');
      } else {
        await addWishlistItem(movie);
        setInWishlist(true);
        setMessage('Saved to wishlist');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setInWishlist(true);
        setMessage('Already in wishlist');
      } else {
        setMessage(
          err.response?.data?.message || err.message || 'Wishlist update failed'
        );
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wishlist-actions">
      <button
        type="button"
        className={inWishlist ? 'btn btn--danger' : 'btn'}
        onClick={handleClick}
        disabled={busy}
        aria-pressed={inWishlist}
      >
        {busy
          ? 'Please wait...'
          : inWishlist
            ? 'Remove from Wishlist'
            : 'Add to Wishlist'}
      </button>
      {message ? <p className="wishlist-actions__msg">{message}</p> : null}
    </div>
  );
}

export default WishlistButton;
