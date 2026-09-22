const GUEST_ID_KEY = 'movieDiscoveryGuestId';

/**
 * Get or create an anonymous guest id stored in localStorage.
 * Used so wishlist works without login.
 */
function getGuestId() {
  let guestId = localStorage.getItem(GUEST_ID_KEY);

  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem(GUEST_ID_KEY, guestId);
  }

  return guestId;
}

export default getGuestId;
