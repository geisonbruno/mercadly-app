import { ShoppingItem } from "@/types/item";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
import { ShoppingListService } from "../../services/shoppingListService";

export default function ListScreen() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [confirmDelete, setConfirmDelete] = useState<ShoppingItem | null>(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const [editing, setEditing] = useState<ShoppingItem | null>(null);
  const [qty, setQty] = useState("");
  

  const load = async () => {
    try {
      setLoading(true);
      const data = await ShoppingListService.getAll();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // recarrega ao voltar para a aba
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const openEdit = (it: ShoppingItem) => {
    setEditing(it);
    setQty(it.quantity ?? "1");
    setTitle(it.name ?? "");
    setSubtitle(it.subtitle ?? "");
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await ShoppingListService.update(editing.id, {
        name: title.trim() || editing.name,
        subtitle: subtitle,
        quantity: qty,
      });
      setEditing(null);
      load();
    } catch (e) {
      console.error("Erro ao editar item:", e);
    }
  };

  const removeItem = (id: string) => {
    Alert.alert("Remover", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await ShoppingListService.remove(id);
            load();
          } catch (e) {
            console.error("Erro ao remover:", e);
          }
        },
      },
    ]);
  };

  const onPressX = async (it: ShoppingItem) => {
    if (!it.checked) {
      setItems((prev) =>
        prev.map((x) => (x.id === it.id ? { ...x, checked: true } : x))
      );
      try {
        await ShoppingListService.update(it.id, { checked: true });
      } catch (e) {
        setItems((prev) =>
          prev.map((x) => (x.id === it.id ? { ...x, checked: false } : x))
        );
        console.error("Falha ao marcar como riscado:", e);
      }
      return;
    }
    setConfirmDelete(it);
  };

  const renderItem = ({ item }: { item: ShoppingItem }) => (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.img} />
      ) : (
        <View style={[styles.img, styles.imgPlaceholder]}>
          <Feather name="image" size={18} color="#9CA3AF" />
        </View>
      )}

      <View style={styles.centerCell}>
        <Text
          numberOfLines={1}
          style={[styles.title, item.checked && styles.strike]}
        >
          {item.name}
        </Text>

        {!!item.subtitle && (
          <Text
            numberOfLines={1}
            style={[styles.sub, item.checked && styles.strikeLight]}
          >
            {item.subtitle}
          </Text>
        )}
      </View>

      <Text style={[styles.qty, item.checked && styles.strike]}>
        {item.quantity}
      </Text>

      <Pressable onPress={() => onPressX(item)} style={styles.iconBtn}>
        <AntDesign name="close" size={18} color="#6b7280" />
      </Pressable>

      <Pressable onPress={() => openEdit(item)} style={styles.iconBtn}>
        <Feather name="edit-2" size={18} color="#6b7280" />
      </Pressable>
    </View>
  );

  

return (
  <SafeAreaView style={styles.safe}>
    <View style={styles.headerWrap}>
      <Text style={styles.header}>My List</Text>
    </View>

    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 24 }}
      ItemSeparatorComponent={() => <View style={styles.sep} />}
      ListEmptyComponent={!loading ? (
        <Text style={styles.empty}>Sua lista está vazia.</Text>
      ) : null}
    />

    {/* Modal editar item (título, descrição, quantidade) */}
    <Modal visible={!!editing} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Editar item</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
            style={[styles.input, { marginBottom: 8 }]}
          />

          <TextInput
            value={subtitle}
            onChangeText={setSubtitle}
            placeholder="Descrição"
            style={[styles.input, { marginBottom: 8 }]}
          />

          <TextInput
            value={qty}
            onChangeText={setQty}
            placeholder="Quantidade"
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.row}>
            <Pressable
              style={[styles.btn, styles.btnGhost]}
              onPress={() => setEditing(null)}
            >
              <Text style={styles.btnGhostText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.btnPrimary]}
              onPress={saveEdit}
            >
              <Text style={styles.btnPrimaryText}>Salvar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>

    {/* Modal confirmar exclusão */}
    <Modal
      visible={!!confirmDelete}
      transparent
      animationType="fade"
      onRequestClose={() => setConfirmDelete(null)}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Deseja excluir este item da lista?</Text>

          {!!confirmDelete?.name && (
            <Text style={{ color: "#6b7280", marginBottom: 8 }} numberOfLines={2}>
              {confirmDelete.name}
            </Text>
          )}

          <View style={styles.row}>
            <Pressable
              style={[styles.btn, styles.btnGhost]}
              onPress={() => setConfirmDelete(null)}
            >
              <Text style={styles.btnGhostText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.btnPrimary]}
              onPress={async () => {
                const id = confirmDelete!.id;
                setConfirmDelete(null);
                try {
                  await ShoppingListService.remove(id);
                  await load();
                } catch (e) {
                  console.error("Erro ao remover:", e);
                }
              }}
            >
              <Text style={styles.btnPrimaryText}>Remover</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  </SafeAreaView>
);

}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  headerWrap: { paddingTop: 8, paddingBottom: 6, alignItems: "center" },
  header: { fontSize: 18, fontWeight: "700" },
  strike: { textDecorationLine: "line-through", color: "#9CA3AF" },
  strikeLight: { textDecorationLine: "line-through", color: "#D1D5DB" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  img: { width: 52, height: 52, borderRadius: 12 },
  imgPlaceholder: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  centerCell: { flex: 1 },
  title: { fontSize: 15, fontWeight: "700" },
  sub: { color: "#6b7280", marginTop: 2 },
  qty: { marginRight: 8, fontWeight: "700", color: "#111827" },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sep: { height: 1, backgroundColor: "#E5E7EB", marginHorizontal: 16 },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#fff",
    width: "86%",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: { fontWeight: "700", fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  row: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  btnGhost: { backgroundColor: "#F3F4F6" },
  btnGhostText: { color: "#111827" },
  btnPrimary: { backgroundColor: "#111827" },
  btnPrimaryText: { color: "#fff", fontWeight: "700" },

  empty: { textAlign: "center", color: "#6b7280", marginTop: 24 },
});
