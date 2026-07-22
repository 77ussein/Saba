"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/data";

export type Language = "ar" | "en";
export type CartItem = { product: Product; quantity: number };

type Store = {
  lang: Language;
  toggle: () => void;
  cart: CartItem[];
  wishlist: Product[];
  cartCount: number;
  add: (product: Product, quantity?: number) => void;
  remove: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  wish: (product: Product) => void;
  isWished: (slug: string) => boolean;
};

const StoreContext = createContext<Store | null>(null);
const STORAGE_KEY = "saba-store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("ar");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const restored = useRef(false);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
        if (saved?.lang === "ar" || saved?.lang === "en") setLang(saved.lang);
        if (Array.isArray(saved?.cart)) setCart(saved.cart);
        if (Array.isArray(saved?.wishlist)) setWishlist(saved.wishlist);
        restored.current = true;
      } catch { restored.current = true; }
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, cart, wishlist }));
  }, [lang, cart, wishlist]);

  const toggle = useCallback(() => setLang((value) => (value === "ar" ? "en" : "ar")), []);
  const add = useCallback((product: Product, quantity = 1) => {
    setCart((items) => {
      const current = items.find((item) => item.product.slug === product.slug);
      return current
        ? items.map((item) => item.product.slug === product.slug ? { ...item, quantity: item.quantity + quantity } : item)
        : [...items, { product, quantity }];
    });
  }, []);
  const remove = useCallback((slug: string) => setCart((items) => items.filter((item) => item.product.slug !== slug)), []);
  const setQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity < 1) return remove(slug);
    setCart((items) => items.map((item) => item.product.slug === slug ? { ...item, quantity } : item));
  }, [remove]);
  const wish = useCallback((product: Product) => setWishlist((items) => items.some((item) => item.slug === product.slug) ? items.filter((item) => item.slug !== product.slug) : [...items, product]), []);
  const isWished = useCallback((slug: string) => wishlist.some((item) => item.slug === slug), [wishlist]);
  const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);
  const value = useMemo(() => ({ lang, toggle, cart, wishlist, cartCount, add, remove, setQuantity, wish, isWished }), [lang, toggle, cart, wishlist, cartCount, add, remove, setQuantity, wish, isWished]);

  return <StoreContext value={value}>{children}</StoreContext>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("StoreProvider missing");
  return value;
}
