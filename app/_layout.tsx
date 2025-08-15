import { useAuth } from "@/hooks/useAuth";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// garante que a splash não suma antes da sessão restaurar
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // esconde a splash quando o estado de auth estiver resolvido
  useEffect(() => {
    if (!loading) SplashScreen.hideAsync().catch(() => {});
  }, [loading]);

  useEffect(() => {
    if (loading) return; 

    const current = segments[0] ?? null;
    const isPublic = current === "login" || current === "register";
    const isTabs = current === "(tabs)";

    // não logado tentando rota privada → manda pro login
    if (!user && !isPublic) {
      router.replace("/login");
      return;
    }

    if (user && isPublic) {
      router.replace("/list");
      return;
    }

  }, [loading, user, segments, router]);

  if (loading) return null;

  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
}
