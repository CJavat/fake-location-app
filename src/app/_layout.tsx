import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="favorites"
        options={{
          title: "Ubicaciones Favoritas",
          headerStyle: { backgroundColor: "#FFF" },
          headerShown: true,
          headerTintColor: "#000",
          presentation: "card",
        }}
      />
    </Stack>
  );
}
