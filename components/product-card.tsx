"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/data";
import { useStore } from "./store-provider";

export function ProductCard({ p }: { p: Product }) {
  const { add, wish, isWished, lang } = useStore();
  const discount = Math.round((1 - p.price / p.original) * 100);
  const wished = isWished(p.slug);
  const name = lang === "ar" ? p.name : p.nameEn;
  return <article className="group relative min-w-0">
    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
      <Link href={`/product/${p.slug}`} aria-label={name}><Image src={p.image} alt={name} fill className="object-cover transition duration-700 group-hover:scale-105" /></Link>
      <span className="absolute start-3 top-3 bg-foreground px-3 py-1 text-[10px] text-background">-{discount}%</span>
      <button onClick={() => wish(p)} className="absolute end-3 top-3 grid size-10 place-items-center rounded-full bg-background/90 transition hover:bg-primary" aria-label={lang === "ar" ? "تبديل المفضلة" : "Toggle wishlist"} aria-pressed={wished}><Heart fill={wished ? "currentColor" : "none"} /></button>
      <button onClick={() => add(p)} className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 bg-foreground px-3 py-3 text-xs text-background opacity-100 transition sm:inset-x-4 sm:bottom-4 lg:translate-y-3 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"><ShoppingBag />{lang === "ar" ? "إضافة للسلة" : "Add to cart"}</button>
    </div>
    <div className="flex min-w-0 flex-col gap-2 py-4"><div className="flex items-center gap-1 text-xs text-primary"><Star fill="currentColor" /> {p.rating} <span className="text-muted-foreground">({p.reviews})</span></div><Link href={`/product/${p.slug}`} className="truncate text-base font-semibold hover:text-primary">{name}</Link><div className="flex flex-wrap items-center gap-3"><b>{p.price} {lang === "ar" ? "ر.س" : "SAR"}</b><del className="text-sm text-muted-foreground">{p.original} {lang === "ar" ? "ر.س" : "SAR"}</del></div></div>
  </article>;
}
