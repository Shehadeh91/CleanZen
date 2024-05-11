import {create} from 'zustand';


export const useUser = create((set) => ({
    user: '', // Initial value for user
    setUser: (value) => set({ user: value }),
  }));

  export const useName = create((set) => ({
    name: '', // Initial value for name
    setName: (value) => set({ name: value }),
  }));
  export const useEmail = create((set) => ({
    email: '', // Initial value for emailr
    setEmail: (value) => set({ email: value }),
  }));
//   export const usePassword = create((set) => ({
//     password: '', // Initial value for password
//     setPassword: (value) => set({ password: value }),
//   }));
  export const usePhone = create((set) => ({
    phone: '', // Initial value for phone
    setPhone: (value) => set({ phone: value }),
  }));

  export const useAddress = create((set) => ({
    address: 'Winnipeg, MB, Canada', // Initial value for phone
    setAddress: (value) => set({ address: value }),
  }));

export const usePageIndex = create((set) => ({
    index: 0, // Initial value for index
    setIndex: (value) => set({ index: value }),
  }));

  export const useBottomNavigationVisible = create((set) => ({
    visible: true, // Initial value for visibility
    setVisible: (value) => set({ visible: value }), // Function to set visibility
  }));

  