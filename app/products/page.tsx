"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";
import { products } from "@/lib/data";

export default function Products() {
  const { lang } = useStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const text = (ar: string, en: string) => lang === "ar" ? ar : en;
  const categories = [{ value: "all", ar: "الكل", en: "All" }, { value: "العطور", ar: "العطور", en: "Perfumes" }, { value: "المجوهرات", ar: "المجوهرات", en: "Jewelry" }, { value: "الهدايا", ar: "الهدايا", en: "Gifts" }];
  const list = useMemo(() => products.filter((product) => (category === "all" || product.category === category) && `${product.name} ${product.nameEn}`.toLowerCase().includes(query.toLowerCase())), [query, category]);
  return <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-xs tracking-[.25em] text-primary">{text("مجموعة SABA", "The SABA collection")}</p><h1 className="mt-3 text-4xl font-bold md:text-6xl">{text("كل المنتجات", "All products")}</h1><p className="mt-3 text-sm text-muted-foreground">{text(`${list.length} قطعة مختارة بعناية`, `${list.length} carefully selected pieces`)}</p></div><label className="flex min-w-0 items-center gap-3 border-b py-3 sm:min-w-72"><Search /><span className="sr-only">{text("بحث", "Search")}</span><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none" placeholder={text("ابحث في المجموعة...", "Search the collection...")} /></label></div><div className="mb-8 flex flex-col justify-between gap-4 border-y py-4 sm:flex-row sm:items-center"><span className="flex items-center gap-2 text-sm"><SlidersHorizontal /> {text("تصفية وفرز", "Filter & sort")}</span><div className="flex flex-wrap gap-5 text-xs">{categories.map((item) => <button key={item.value} onClick={() => setCategory(item.value)} className={category === item.value ? "text-primary" : ""}>{item[lang]}</button>)}</div></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.map((product) => <ProductCard key={product.slug} p={product} />)}</div></div>;
}
