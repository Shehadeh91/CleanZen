import {create} from 'zustand';

export  const useCarPlateStore = create((set) => ({
  carPlate: '', // Initial value for carPlate
  setCarPlate: (value) => set({ carPlate: value }),
}));


export const useCarBrandStore = create((set) => ({
  carBrand: 'Mazda', // Initial value for CarBrand
  setCarBrand: (value) => set({ carBrand: value }),
}));

export const useIconCarBrandStore = create((set) => ({
  iconBrand: (require('./assets/Icons/ford.png')), // Initial icon source
  setIconBrand: (value) => set({ iconBrand: value }),
}));

export const useBodyStyleStore = create((set) => ({
  bodyStyle: 'Sedan', // Initial value for BodyType
  setBodyStyle: (value) => set({ bodyStyle: value }),
}));

export const useIconBodyStyleStore = create((set) => ({
  iconBodyStyle: (require('./assets/Icons/Sedan.png')), // Initial icon source
  setIconBodyStyle: (value) => set({ iconBodyStyle: value }),
}));

export const useNoteStore = create((set) => ({
  note: '', // Initial value for Note
  setNote: (value) => set({ note: value }),
}));

export const useCarColorStore = create((set) => ({
  currentColor: '', // Initial value for Color
  setCurrentColor: (value) => set({ currentColor: value }),
}));

export const usePaymentOptionStore = create((set) => ({
  paymentOption: 'Cash', // Initial value for paymentOption
  setPaymentOption: (value) => set({ paymentOption: value }),
}));

export const useDeliveryOptionStore = create((set) => ({
  deliveryOption: 'Standard', // Initial value for deliveryOption
  setDeliveryOption: (value) => set({ deliveryOption: value }),
}));

export const usePrefrenceOptionStore = create((set) => ({
  prefrenceOption: 'Exterior', // Initial value for prefrenceOption
  setPrefrenceOption: (value) => set({ prefrenceOption: value }),
}));

export const useDeliveryCostStore = create((set) => ({
  deliveryCost: 0, // Initial value for deliveryCost
  setDeliveryCost: (value) => set({ deliveryCost: value }),
}));

export const usePrefrenceCostStore = create((set) => ({
  prefrenceCost: 0, // Initial value for prefrenceCost
  setPrefrenceCost: (value) => set({ prefrenceCost: value }),
}));

export const useBodyStyleCostStore = create((set) => ({
  bodyStyleCost: 25, // Initial value for bodyStyleCost
  setBodyStyleCost: (value) => set({ bodyStyleCost: value }),
}));

export const useTotalCostStore = create((set) => ({
  totalCost: 25, // Initial value for totalCost
  updateTotalCost: (value) => set({ totalCost: value }),
}));

export const useDateStore = create((set) => ({
  date: "30-45 min", // Initial value for date
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
