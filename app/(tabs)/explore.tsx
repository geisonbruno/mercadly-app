import { AntDesign, Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
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
        await ProductsService.seedDefaultsOnce();
        const data = await ProductsService.list();
        setProducts(data);
        setFiltered(data);
      } catch (e) {
        console.error(e);
      } finally {
        setBusy(false);
      }
    })();
  }, [user, loading]);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    setFiltered(
      term
        ? products.filter((p) => (p.name || "").toLowerCase().includes(term))
        : products
    );
  }, [search, products]);

  const countLabel = useMemo(() => {
    if (busy) return "Carregando…";
    const n = filtered.length;
    return n === 0
      ? "Nenhum produto encontrado."
      : `${n} produto${n > 1 ? "s" : ""}`;
  }, [busy, filtered.length]);

  const addToMyList = async (p: Product) => {
    try {
      await ShoppingListService.add(p.name, "1", {
        subtitle: p.description ?? "",
        imageUrl: p.imageURL ?? null,
      });
    } catch (e) {
      console.error("Falha ao adicionar:", e);
    }
  };

  if (loading || busy) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Feather
            name="search"
            size={18}
            color="#6b7280"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search products"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            style={styles.searchInput}
          />
        </View>
        <Pressable style={styles.roundBtn} onPress={() => {}}>
          <Feather name="sliders" size={18} color="#111827" />
        </Pressable>
      </View>

      <Text style={styles.helperText}>{countLabel}</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id!}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Imagem */}
            {item.imageURL ? (
              <Image source={{ uri: item.imageURL }} style={styles.img} />
            ) : (
              <View style={[styles.img, styles.imgPlaceholder]}>
                <Feather name="image" size={20} color="#9CA3AF" />
              </View>
            )}

            {/* Infos */}
            <View style={styles.centerCell}>
              <Text numberOfLines={1} style={styles.cardTitle}>
                {item.name}
              </Text>
              {item.description ? (
                <Text numberOfLines={1} style={styles.cardSub}>
                  {item.description}
                </Text>
              ) : null}
              {item.category ? (
                <Text numberOfLines={1} style={styles.cardTag}>
                  {item.category}
                </Text>
              ) : null}
            </View>

            {/* Botão + */}
            <Pressable onPress={() => addToMyList(item)} style={styles.addBtn}>
              <AntDesign name="plus" size={20} color="#fff" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhum produto encontrado.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F6F8" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: { flex: 1, fontSize: 15 },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  helperText: {
    color: "#6b7280",
    marginTop: 8,
    marginBottom: 6,
    marginHorizontal: 16,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 12,
  },
  img: { width: 60, height: 60, borderRadius: 12 },
  imgPlaceholder: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  centerCell: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  cardSub: { color: "#6b7280", marginTop: 2 },
  cardTag: { color: "#059669", marginTop: 2, fontSize: 12, fontWeight: "600" },

  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 24 },
});
