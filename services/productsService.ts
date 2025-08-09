import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export type Product = {
  id?: string;
  name: string;
  description?: string;
  imageURL?: string;
  createdBy?: string;
  createdAt?: any;
  category?: string;
};

const productsRef = collection(db, "products");

// alguns itens 
const defaultProducts: Omit<Product, "id">[] = [
  { name: "Arroz 5kg", description: "Arroz branco tipo 1", category: "Mercearia" },
  { name: "Feijão 1kg", description: "Carioca ou preto", category: "Mercearia" },
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
    if (!snap.empty) return; // já tem dados

    // opcional: usa IDs fixos pra evitar duplicar em reset de dev
    for (const p of defaultProducts) {
      const id = p.name.toLowerCase().replace(/\s+/g, "-").slice(0, 40);
      await setDoc(doc(productsRef, id), {
        ...p,
        createdAt: serverTimestamp(),
      });
    }
  },
};
