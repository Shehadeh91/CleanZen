import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create context for credentials
export const CredentialsContext = createContext({
  storedCredentials: null,
  setStoredCredentials: () => {},
});
