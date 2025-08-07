import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  explore: "search-outline",
  list: "cart-outline",
  account: "person-outline",
};


export default function BottomTabs() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#34a853",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#ddd",
          height: 80,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
        tabBarIcon: ({ color, size = 24 }) => {
          const iconName = icons[route.name] ?? "ellipse";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="list" options={{ title: "List" }} />
      <Tabs.Screen name="account" options={{ title: "Account" }} />
    </Tabs>
  );
}
