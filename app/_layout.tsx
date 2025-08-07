import { useAuth } from "@/hooks/useAuth";
import { Redirect, Slot, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();

  if (loading) return null;

  const currentRoute = segments[0];
  const publicRoutes = ["login", "register"];

  if (!user && !publicRoutes.includes(currentRoute)) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
