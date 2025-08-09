// app/(tabs)/explore.tsx
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { Product, ProductsService } from "../../services/productsService";
import { ShoppingListService } from "../../services/shoppingListService";

export default function ExploreScreen() {
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (loading || !user) return;

    (async () => {
      try {
        // garante que temos itens “de loja”
        await ProductsService.seedDefaultsOnce();

        const data = await ProductsService.list();
        setProducts(data);
        setFiltered(data);
      } catch (e: any) {
        console.error(e);
        Alert.alert("Erro", "Não foi possível carregar os produtos.");
      } finally {
        setBusy(false);
      }
    })();
  }, [user, loading]);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    setFiltered(
      term
        ? products.filter((p) => p.name?.toLowerCase().includes(term))
        : products
    );
  }, [search, products]);

  const addToMyList = async (p: Product) => {
    try {
      await ShoppingListService.add(p.name, "1");
      Alert.alert("Adicionado", `"${p.name}" foi adicionado à sua lista.`);
    } catch (e: any) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível adicionar o item.");
    }
  };

  if (loading || busy) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar produtos..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id!}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri:
                  item.imageURL?.trim() ||
                  "https://via.placeholder.com/120x120.png?text=Produto",
              }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              {!!item.description && (
                <Text style={styles.description}>{item.description}</Text>
              )}
              {!!item.category && (
                <Text style={styles.category}>{item.category}</Text>
              )}
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={() => addToMyList(item)}>
              <Text style={styles.addTxt}>＋</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 24 }}>
            Nenhum produto encontrado.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    gap: 12,
  },
  image: { width: 60, height: 60, borderRadius: 8, backgroundColor: "#eee" },
  info: { flex: 1, gap: 2 },
  name: { fontSize: 16, fontWeight: "700" },
  description: { fontSize: 13, color: "#666" },
  category: { fontSize: 12, color: "#2e7d32" },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 50,
    backgroundColor: "#34a853",
    alignItems: "center",
    justifyContent: "center",
  },
  addTxt: { color: "#fff", fontSize: 22, lineHeight: 22 },
});
