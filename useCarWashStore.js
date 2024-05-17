import { create } from "zustand";

const useCarWashStore = create((set, get) => ({
  carPlate: "", // Initial value for carPlate
  setCarPlate: (value) => set({ carPlate: value }),

  carBrand: "Mazda", // Initial value for CarBrand
  setCarBrand: (value) => set({ carBrand: value }),

  iconBrand: require("./assets/Icons/ford.png"), // Initial icon source
  setIconBrand: (value) => set({ iconBrand: value }),

  bodyStyle: "Sedan", // Initial value for BodyType
  setBodyStyle: (value) => set({ bodyStyle: value }),

  iconBodyStyle: require("./assets/Icons/Sedan.png"), // Initial icon source
  setIconBodyStyle: (value) => set({ iconBodyStyle: value }),

  note: "", // Initial value for Note
  setNote: (value) => set({ note: value }),

  currentColor: "", // Initial value for Color
  setCurrentColor: (value) => set({ currentColor: value }),

  paymentOption: "Cash", // Initial value for paymentOption
  setPaymentOption: (value) => set({ paymentOption: value }),

  deliveryOption: "Standard", // Initial value for deliveryOption
  setDeliveryOption: (value) => set({ deliveryOption: value }),

  prefrenceOption: "Exterior", // Initial value for prefrenceOption
  setPrefrenceOption: (value) => set({ prefrenceOption: value }),

  deliveryCost: 0, // Initial value for deliveryCost
  setDeliveryCost: (value) => set({ deliveryCost: value }),

  prefrenceCost: 0, // Initial value for prefrenceCost
  setPrefrenceCost: (value) => set({ prefrenceCost: value }),

  bodyStyleCost: 25, // Initial value for bodyStyleCost
  setBodyStyleCost: (value) => set({ bodyStyleCost: value }),

  totalCost: 25, // Initial value for totalCost
  updateTotalCost: (value) => set({ totalCost: value }),

  date: "45 - 60 min", // Initial value for date
  setDate: (value) => set({ date: value }),
  // getFormattedDate: () => {
  //   const date = new Date();
  //   const day = date.toLocaleString("en-US", { weekday: "long" });
  //   const month = date.toLocaleString("en-US", { month: "long" });
  //   const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  //   const minutes = date.getMinutes();
  //   const period = date.getHours() >= 12 ? "PM" : "AM";

  //   return `${day}, ${month} ${date.getDate()}, ${hours}:${minutes} ${period}`;
  // },
}));
export default useCarWashStore;
