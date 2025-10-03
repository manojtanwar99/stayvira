import { create } from "zustand";
import axios from "axios";

export const useStore = create((set) => ({
  listings: [],
  
  fetchListings: async () => {
    const res = await axios.get("http://localhost:5000/listings");
    set({ listings: res.data });
  },

  addListing: async (listing) => {
    const res = await axios.post("http://localhost:5000/listings", listing);
    set((state) => ({ listings: [...state.listings, res.data] }));
  },

  updateListing: async (id, listing) => {
    const res = await axios.put(`http://localhost:5000/listings/${id}`, listing);
    set((state) => ({
      listings: state.listings.map((l) => (l._id === id ? res.data : l))
    }));
  },

  removeListing: async (id) => {
    await axios.delete(`http://localhost:5000/listings/${id}`);
    set((state) => ({
      listings: state.listings.filter((l) => l._id !== id)
    }));
  },
}));
