import WishlistItem from '../models/WishlistItem.js';

function getGuestId(req) {
  const fromHeader = req.headers['x-guest-id'];
  const fromQuery = req.query.guestId;
  const fromBody = req.body?.guestId;

  const guestId = (fromHeader || fromQuery || fromBody || '').toString().trim();
  return guestId;
}

async function getWishlist(req, res, next) {
  try {
    const guestId = getGuestId(req);

    if (!guestId) {
      return res.status(400).json({ message: 'guestId is required' });
    }

    const items = await WishlistItem.find({ guestId })
      .sort({ createdAt: -1 })
      .lean();

    const results = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      results.push({
        movieId: item.movieId,
        title: item.title,
        posterUrl: item.posterPath || null,
        releaseYear: item.releaseYear,
        rating: item.rating,
        createdAt: item.createdAt,
      });
    }

    return res.json({ results });
  } catch (error) {
    return next(error);
  }
}

async function addToWishlist(req, res, next) {
  try {
    const guestId = getGuestId(req);
    const { movieId, title, posterUrl, posterPath, releaseYear, rating } =
      req.body || {};

    if (!guestId) {
      return res.status(400).json({ message: 'guestId is required' });
    }

    const id = Number(movieId);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'movieId must be a positive number' });
    }

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'title is required' });
    }

    const poster = posterUrl || posterPath || null;

    try {
      const created = await WishlistItem.create({
        guestId,
        movieId: id,
        title: title.trim(),
        posterPath: poster,
        releaseYear: releaseYear || null,
        rating: typeof rating === 'number' ? rating : null,
      });

      return res.status(201).json({
        movieId: created.movieId,
        title: created.title,
        posterUrl: created.posterPath,
        releaseYear: created.releaseYear,
        rating: created.rating,
        createdAt: created.createdAt,
      });
    } catch (error) {
      // Duplicate key → already in wishlist
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Movie is already in wishlist' });
      }
      throw error;
    }
  } catch (error) {
    return next(error);
  }
}

async function removeFromWishlist(req, res, next) {
  try {
    const guestId = getGuestId(req);
    const movieId = Number(req.params.movieId);

    if (!guestId) {
      return res.status(400).json({ message: 'guestId is required' });
    }

    if (!Number.isInteger(movieId) || movieId < 1) {
      return res.status(400).json({ message: 'movieId must be a positive number' });
    }

    const deleted = await WishlistItem.findOneAndDelete({ guestId, movieId });

    if (!deleted) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }

    return res.json({ message: 'Removed from wishlist', movieId });
  } catch (error) {
    return next(error);
  }
}

export { getWishlist, addToWishlist, removeFromWishlist };
