// themes.js
import { MD3DarkTheme, MD3LightTheme, PaperProvider, shadow } from 'react-native-paper';

// Define light theme
export const lightTheme = {
  ...MD3LightTheme,

  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee', // Default primary color
    onPrimary: '#ffffff', // Color for content on primary color
    secondary: '#03dac6', // Default secondary color
    onSecondary: '#000000', // Color for content on secondary color
    background: '#ffffff', // Default background color
    onBackground: '#000000', // Color for content on background
    surface: '#ffffff', // Default surface color
    onSurface: '#000000', // Color for content on surface
    error: '#b00020', // Default error color
    onError: '#ffffff', // Color for content on error color
    // Additional colors can be customized if needed
    shadow: 'red'
  },

};

// Define dark theme
export const darkTheme = {
  ...MD3DarkTheme,
 colors: {
    ...MD3DarkTheme.colors,
    primary: '#bb86fc', // Default primary color
    onPrimary: '#000000', // Color for content on primary color
    secondary: '#03dac6', // Default secondary color
    onSecondary: '#000000', // Color for content on secondary color
    background: '#121212', // Default background color
    onBackground: '#ffffff', // Color for content on background
    surface: '#121212', // Default surface color
    onSurface: '#ffffff', // Color for content on surface
    error: '#cf6679', // Default error color
    onError: '#000000', // Color for content on error color
    // Additional colors can be customized if needed
  },
};
