import { create } from "zustand";
import dryCleanData from "./assets/dryCleanData.json";


// Initialize item counts to 0 for all items
const initialItemCounts = Object.fromEntries(
  dryCleanData.map((item) => [item.id, 0])
);
// Zustand store
const useDryCleanCart = create((set, get) => ({
  laundryItems: dryCleanData,
  itemCounts: { ...initialItemCounts }, // Track item counts
  deliveryCost: 0,
  setDeliveryCost: (cost) => set({ deliveryCost: cost }),
  
  deliveryOption: "Standard",
  setDeliveryOption: (option) => set({ deliveryOption: option }),
  addToCart: (itemId) =>
    set((state) => ({
      itemCounts: {
        ...state.itemCounts,
        [itemId]: state.itemCounts[itemId] + 1, // Increment count for the item
      },
    })),
  removeFromCart: (itemId) =>
    set((state) => ({
      itemCounts: {
        ...state.itemCounts,
        [itemId]: Math.max(0, state.itemCounts[itemId] - 1), // Decrement count but not below 0
      },
    })),
  clearCart: () =>
    set({
      itemCounts: { ...initialItemCounts }, // Reset item counts
    }),
  getTotalPrice: () => {
    const state = get(); // Access the current state

    const totalPrice = dryCleanData
      .filter((item) => state.itemCounts[item.id] > 0) // Only consider items with counts > 0
      .reduce((total, item) => {
        const itemTotal = item.price * state.itemCounts[item.id];

        return total + itemTotal ;
      }, 0); // Calculate total price based on counts

    return totalPrice;
  },
}));

export default useDryCleanCart;
