import { create } from "zustand";
import apiClient from "../services/apiClient"; 
export const useListingStore = create((set, get) => ({
  // --- STATE ---
  listings: [],
  isLoading: false,
  error: null,

  // --- ACTIONS ---

  /**
   * Fetches all listings from the server and updates the state.
   */
  fetchListings: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.get("/listings");
      set({ listings: res.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch listings.", isLoading: false });
      console.error("Error fetching listings:", error);
    }
  },

  /**
   * Adds a new listing.
   */
  addListing: async (listingData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post("/listings", listingData);
      set((state) => ({
        listings: [...state.listings, res.data],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to add listing.", isLoading: false });
      console.error("Error adding listing:", error);
    }
  },

  /**
   * Updates an existing listing.
   */
  updateListing: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.put(`/listings/${id}`, updatedData);
      set((state) => ({
        listings: state.listings.map((l) => (l._id === id ? res.data : l)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: "Failed to update listing.", isLoading: false });
      console.error("Error updating listing:", error);
    }
  },

  /**
   * Removes a listing with an optimistic update for better UX.
   */
  removeListing: async (id) => {
    // Optimistic update: remove from UI immediately
    const originalListings = get().listings;
    set((state) => ({
      listings: state.listings.filter((l) => l._id !== id),
    }));

    try {
      // Make the API call
      await apiClient.delete(`/listings/${id}`);
    } catch (error) {
      // If API call fails, revert the state and set an error
      set({ listings: originalListings, error: "Failed to remove listing." });
      console.error("Error removing listing:", error);
    }
  },
}));