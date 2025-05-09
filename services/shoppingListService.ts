import { ShoppingItem } from "@/types/item";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

const LIST_ID = "main";
const itemsRef = collection(db, "shoppingLists", LIST_ID, "items");

export const ShoppingListService = {
  async getAll(): Promise<ShoppingItem[]> {
    const q = query(itemsRef, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as ShoppingItem)
    );
  },

  async add(name: string, quantity: string) {
    return await addDoc(itemsRef, {
      name,
      quantity,
      updatedAt: Timestamp.now(),
    });
  },

  async update(id: string, data: Partial<ShoppingItem>) {
    const itemDoc = doc(db, "shoppingLists", LIST_ID, "items", id);
    return await updateDoc(itemDoc, { ...data, updatedAt: Timestamp.now() });
  },

  async remove(id: string) {
    const itemDoc = doc(db, "shoppingLists", LIST_ID, "items", id);
    return await deleteDoc(itemDoc);
  },
};
