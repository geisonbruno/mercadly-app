import { auth, db } from "@/config/firebase";
import { ShoppingItem } from "@/types/item";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

const LIST_ID = "main";
const listDoc = doc(db, "shoppingLists", LIST_ID);
const itemsRef = collection(db, "shoppingLists", LIST_ID, "items");

async function ensureListAndMembership() {
  const uid = auth.currentUser?.uid;
  const snap = await getDoc(listDoc);
  if (!snap.exists()) {
    await setDoc(
      listDoc,
      {
        title: "Minha Lista",
        members: uid ? { [uid]: true } : {},
        createdAt: Timestamp.now(),
      },
      { merge: true }
    );
  } else if (uid) {
    await setDoc(listDoc, { members: { [uid]: true } }, { merge: true });
  }
}

export const ShoppingListService = {
  listenAll(cb: (items: ShoppingItem[]) => void, onError?: (e: any) => void) {
    const q = query(itemsRef, orderBy("updatedAt", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ShoppingItem)));
      },
      (err) => onError?.(err)
    );
  },

  async getAll(): Promise<ShoppingItem[]> {
    const q = query(itemsRef, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (d) => ({ id: d.id, ...d.data() } as ShoppingItem)
    );
  },

  async add(
    name: string,
    quantity: string,
    extra?: { subtitle?: string; imageUrl?: string | null }
  ) {
    await ensureListAndMembership();
    return await addDoc(itemsRef, {
      name,
      quantity,
      subtitle: extra?.subtitle ?? "",
      imageUrl: extra?.imageUrl ?? null,
      checked: false,
      updatedAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      createdBy: auth.currentUser?.uid ?? null,
    });
  },

  async update(id: string, data: Partial<ShoppingItem>) {
    await ensureListAndMembership();
    const itemDoc = doc(db, "shoppingLists", LIST_ID, "items", id);
    return await updateDoc(itemDoc, { ...data, updatedAt: Timestamp.now() });
  },

  async remove(id: string) {
    await ensureListAndMembership();
    const itemDoc = doc(db, "shoppingLists", LIST_ID, "items", id);
    return await deleteDoc(itemDoc);
  },
};
