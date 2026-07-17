import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import HomeScreen from ".";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return <HomeScreen />;
}
