import { AppRegistry } from 'react-native';
import App from './App'; // Adjust the path if your App component is located elsewhere
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);