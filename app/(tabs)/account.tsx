import { useAuth } from "@/hooks/useAuth";
import { Button, Text, View } from "react-native";

export default function AccountScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Nome: {user?.displayName || "N/A"}</Text>
      <Text>Email: {user?.email}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
