import { router } from "expo-router";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { db } from "../../config/firebase";
import { useAuth } from "../../hooks/useAuth";
import { ShoppingListService } from "../../services/shoppingListService";
import { ShoppingItem } from "../../types/item";

export default function ShoppingListScreen() {
  const { user, logout, loading } = useAuth();

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");

  // Proteção da rota: redireciona se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  // Carrega lista em tempo real
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "shoppingLists", "main", "items"),
      orderBy("updatedAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as ShoppingItem)
      );
      setItems(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAdd = async () => {
    if (!name.trim() || !quantity.trim()) return;
    await ShoppingListService.add(name, quantity);
    setName("");
    setQuantity("");
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Compras</Text>
      <Button title="Sair" onPress={handleLogout} />

      <TextInput
        style={styles.input}
        placeholder="Nome do item"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
      />
      <Button title="Adicionar" onPress={handleAdd} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>
              {item.name} — {item.quantity}
            </Text>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
});
