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
    set({ isLoading: true, error: null }); // set loading state
    try {
      const res = await apiClient.get("api/listings");
      // Only update listings, do not clear them beforehand to avoid flash
      set({ listings: res.data, isLoading: false });
    //   return res.data;
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
      const res = await apiClient.post("api/listings", listingData);
      set((state) => ({
        listings: [res.data, ...state.listings], // add new listing to the top
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
      const res = await apiClient.put(`api/listings/${id}`, updatedData);
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
   * Removes a listing with optimistic update.
   */
  removeListing: async (id) => {
    const originalListings = get().listings;
    set((state) => ({
      listings: state.listings.filter((l) => l._id !== id),
    }));

    try {
      await apiClient.delete(`api/listings/${id}`);
    } catch (error) {
      set({ listings: originalListings, error: "Failed to remove listing." });
      console.error("Error removing listing:", error);
    }
  },
}));
