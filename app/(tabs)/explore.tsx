import { AntDesign, Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
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

  // ➕ criar produto
  const [createOpen, setCreateOpen] = useState(false);
  const [pName, setPName] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [pEmoji, setPEmoji] = useState("");

  // 🗑️ excluir “meu” produto
  const [confirmDel, setConfirmDel] = useState<Product | null>(null);

  // filtro “somente meus”
  const [mineOnly, setMineOnly] = useState(false);

  // ---------- carga unificada (seeds + meus) ----------
  const load = async () => {
    try {
      setBusy(true);
      await ProductsService.seedDefaultsOnce();
      const [defaults, mine] = await Promise.all([
        ProductsService.list(),     // seeds
        ProductsService.listMine(), // meus
      ]);
      const merged = [...mine, ...defaults]; // meus primeiro
      setProducts(merged);
      setFiltered(merged);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (loading || !user) return;
    load();
  }, [user, loading]);

  // ---------- busca + filtro ----------
  useEffect(() => {
    const term = search.trim().toLowerCase();
    const base = mineOnly ? products.filter((p) => p.isMine) : products;
    const res = term
      ? base.filter((p) =>
          [p.name, p.description]
            .filter(Boolean)
            .some((s) => (s as string).toLowerCase().includes(term))
        )
      : base;
    setFiltered(res);
  }, [search, products, mineOnly]);

  const countLabel = useMemo(() => {
    if (busy) return "Carregando…";
    const n = filtered.length;
    return n === 0 ? "Nenhum produto encontrado." : `${n} produto${n > 1 ? "s" : ""}`;
  }, [busy, filtered.length]);

  // adiciona produto da explore para a List
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
          <Feather name="search" size={18} color="#6b7280" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search products"
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            style={styles.searchInput}
          />
        </View>

        {/* criar produto */}
        <Pressable style={styles.roundBtn} onPress={() => setCreateOpen(true)}>
          <AntDesign name="plus" size={18} color="#111827" />
        </Pressable>

        {/* filtro “somente meus” */}
        <Pressable
          style={[styles.roundBtn, mineOnly && { borderColor: "#22c55e" }]}
          onPress={() => setMineOnly((v) => !v)}
        >
          <Feather name="sliders" size={18} color={mineOnly ? "#22c55e" : "#111827"} />
        </Pressable>
      </View>

      <Text style={styles.helperText}>{countLabel}</Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id!}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Área clicável do card (só abre exclusão se for seu) */}
            <Pressable
              style={styles.cardLeft}
              onPress={() => {
                if (item.isMine) setConfirmDel(item);
              }}
            >
              {/* Imagem / Emoji / Placeholder */}
              {item.emoji ? (
                <View style={[styles.img, styles.emojiCircle]}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
              ) : item.imageURL ? (
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
            </Pressable>

            {/* Botão à direita: sempre adicionar à List */}
            <Pressable onPress={() => addToMyList(item)} style={styles.addBtn}>
              <AntDesign name="plus" size={20} color="#fff" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto encontrado.</Text>}
      />

      {/* Modal: criar produto */}
      <Modal
        visible={createOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Novo produto</Text>

            <TextInput
              value={pName}
              onChangeText={setPName}
              placeholder="Nome (obrigatório)"
              style={[styles.input, { marginBottom: 8 }]}
            />

            <TextInput
              value={pDesc}
              onChangeText={setPDesc}
              placeholder="Descrição (opcional)"
              style={[styles.input, { marginBottom: 8 }]}
            />

            <TextInput
              value={pEmoji}
              onChangeText={setPEmoji}
              placeholder="Emoji (opcional) — ex.: 🍞"
              style={[styles.input, { marginBottom: 8 }]}
            />

            <View style={styles.row}>
              <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => setCreateOpen(false)}>
                <Text style={styles.btnGhostText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={async () => {
                  const name = pName.trim();
                  if (!name) return;
                  try {
                    await ProductsService.createMine({
                      name,
                      description: pDesc.trim(),
                      emoji: pEmoji.trim() || null,
                    });
                    setPName("");
                    setPDesc("");
                    setPEmoji("");
                    setCreateOpen(false);
                    await load();
                  } catch (e) {
                    console.error("Falha ao criar produto:", e);
                  }
                }}
              >
                <Text style={styles.btnPrimaryText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: excluir produto pessoal */}
      <Modal
        visible={!!confirmDel}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDel(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Excluir este produto salvo?</Text>
            {!!confirmDel?.name && (
              <Text style={{ color: "#6b7280", marginBottom: 8 }} numberOfLines={2}>
                {confirmDel.name}
              </Text>
            )}

            <View style={styles.row}>
              <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => setConfirmDel(null)}>
                <Text style={styles.btnGhostText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={async () => {
                  try {
                    await ProductsService.deleteMine(confirmDel!.id!);
                    setConfirmDel(null);
                    await load();
                  } catch (e) {
                    console.error("Falha ao excluir produto:", e);
                  }
                }}
              >
                <Text style={styles.btnPrimaryText}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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

  // parte clicável do card (imagem + textos)
  cardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  img: { width: 60, height: 60, borderRadius: 12 },
  imgPlaceholder: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  emojiCircle: {
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 28 },

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

  // modais
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: { backgroundColor: "#fff", width: "86%", borderRadius: 12, padding: 16 },
  modalTitle: { fontWeight: "700", fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 12 },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  btnGhost: { backgroundColor: "#F3F4F6" },
  btnGhostText: { color: "#111827" },
  btnPrimary: { backgroundColor: "#111827" },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },

  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { textAlign: "center", color: "#6b7280", marginTop: 24 },
});
