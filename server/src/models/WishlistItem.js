import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: true,
      trim: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterPath: {
      type: String,
      default: null,
    },
    releaseYear: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// One guest cannot save the same movie twice
wishlistItemSchema.index({ guestId: 1, movieId: 1 }, { unique: true });
wishlistItemSchema.index({ guestId: 1 });

const WishlistItem = mongoose.model('WishlistItem', wishlistItemSchema);

export default WishlistItem;
