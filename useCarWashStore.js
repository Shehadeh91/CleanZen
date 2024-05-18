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

  deliveryOption: "", // Initial value for deliveryOption
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

  serviceTime: '',

  setServiceTime: (when) => {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();

    // Calculate new time
    const newTime = new Date(currentDate.getTime() + when * 60000); // Convert minutes to milliseconds

    // Format the new time
    const formattedTime = newTime.toLocaleString('default', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    set({ serviceTime: formattedTime });
  },

}));
export default useCarWashStore;
