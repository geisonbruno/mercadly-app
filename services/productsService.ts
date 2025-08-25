import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";

export type Product = {
  id?: string;
  name: string;
  description?: string;
  imageURL?: string;
  createdBy?: string;
  createdAt?: any;
  category?: string;
  emoji?: string | null;
  isMine?: boolean;
};

const productsRef = collection(db, "products");

const myProductsRef = (uid: string) => collection(db, "users", uid, "products");

// alguns itens
const defaultProducts: Omit<Product, "id">[] = [
  {
    name: "Arroz 5kg",
    description: "Arroz branco tipo 1",
    category: "Mercearia",
  },
  {
    name: "Feijão 1kg",
    description: "Carioca ou preto",
    category: "Mercearia",
  },
  { name: "Macarrão 500g", description: "Espaguete", category: "Mercearia" },
  { name: "Açúcar 1kg", description: "Refinado", category: "Mercearia" },
  { name: "Óleo 900ml", description: "Soja", category: "Mercearia" },
  { name: "Sal 1kg", description: "Refinado iodado", category: "Mercearia" },
  { name: "Café 500g", description: "Tradicional", category: "Bebidas" },
  { name: "Leite 1L", description: "Integral UHT", category: "Laticínios" },
  { name: "Ovos dúzia", description: "Grande", category: "Frios" },
  { name: "Carne bovina 1kg", description: "Coxão mole", category: "Açougue" },
  { name: "Frango 1kg", description: "Cortes variados", category: "Açougue" },
  { name: "Tomate 1kg", description: "Tipo salada", category: "Hortifruti" },
  { name: "Batata 1kg", description: "Ágata", category: "Hortifruti" },
  { name: "Alface", description: "Crespa", category: "Hortifruti" },
  { name: "Pão de forma", description: "Tradicional", category: "Padaria" },
];

export const ProductsService = {
  async list(): Promise<Product[]> {
    const snap = await getDocs(query(productsRef));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Product) }));
  },

  async create(p: Omit<Product, "id" | "createdAt">) {
    return addDoc(productsRef, {
      ...p,
      createdAt: serverTimestamp(),
    });
  },

  // roda uma vez: se a coleção estiver vazia, popula com os defaults
  async seedDefaultsOnce() {
    const snap = await getDocs(productsRef);
    if (!snap.empty) return;

    // opcional: usa IDs fixos pra evitar duplicar em reset de dev
    for (const p of defaultProducts) {
      const id = p.name.toLowerCase().replace(/\s+/g, "-").slice(0, 40);
      await setDoc(doc(productsRef, id), {
        ...p,
        createdAt: serverTimestamp(),
      });
    }
  },

  /** Cria um produto pessoal em users/{uid}/products */
  async createMine(input: { name: string; description?: string; emoji?: string | null }) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("not-authenticated");

    return addDoc(myProductsRef(uid), {
      name: input.name,
      description: input.description ?? "",
      emoji: input.emoji ?? null,
      // imageURL: null, // reservado para upload nativo futuro
      createdBy: uid,
      createdAt: serverTimestamp(),
    });
  },

  /** Lista os produtos pessoais do usuário (mais recentes primeiro) */
  async listMine(): Promise<Product[]> {
    const uid = auth.currentUser?.uid;
    if (!uid) return [];
    const q = query(myProductsRef(uid), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
      isMine: true,
    }));
  },

  /** Remove um produto pessoal do usuário */
  async deleteMine(id: string) {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error("not-authenticated");
    const pdoc = doc(db, "users", uid, "products", id);
    return deleteDoc(pdoc);
  },

};
