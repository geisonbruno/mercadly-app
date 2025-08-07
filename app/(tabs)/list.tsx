// app/list/index.tsx
import { router } from 'expo-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../config/firebase';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingListService } from '../../services/shoppingListService';
import { ShoppingItem } from '../../types/item';

export default function ShoppingListScreen() {
  const { user, logout, loading } = useAuth();
  const name = user?.displayName;

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [nameInput, setNameInput] = useState('');
  const [quantity, setQuantity] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'shoppingLists', 'main', 'items'), orderBy('updatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as ShoppingItem));
      setItems(data);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddOrUpdate = async () => {
    if (!nameInput.trim() || !quantity.trim()) return;

    if (editingId) {
      await ShoppingListService.update(editingId, { name: nameInput, quantity });
      setEditingId(null);
    } else {
      await ShoppingListService.add(nameInput, quantity);
    }

    setNameInput('');
    setQuantity('');
  };

  const handleEdit = (item: ShoppingItem) => {
    setEditingId(item.id);
    setNameInput(item.name);
    setQuantity(item.quantity);
  };

  const handleDelete = async (id: string) => {
    await ShoppingListService.remove(id);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
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
      <View style={styles.header}>
        <Text style={styles.title}>Lista de Compras</Text>
        <Button title="Sair" onPress={handleLogout} />
      </View>

      {name && (
        <Text style={styles.welcomeText}>👋 Seja bem-vindo, {name}!</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Nome do item"
        value={nameInput}
        onChangeText={setNameInput}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
      />
      <Button
        title={editingId ? 'Atualizar item' : 'Adicionar item'}
        onPress={handleAddOrUpdate}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.name} — {item.quantity}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text style={styles.actionText}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.actionText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  welcomeText: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionText: {
    fontSize: 18,
    marginLeft: 10,
  },
});
