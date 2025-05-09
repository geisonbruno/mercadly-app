import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000000" },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerShown: false,
      }}
    />
  );
}
