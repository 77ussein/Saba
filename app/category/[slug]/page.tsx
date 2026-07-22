"use client";

import { useParams } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";
import { products } from "@/lib/data";

const categoryNames = { perfumes: { ar: "العطور", en: "Perfumes", value: "العطور" }, jewelry: { ar: "المجوهرات", en: "Jewelry", value: "المجوهرات" }, gifts: { ar: "الهدايا", en: "Gifts", value: "الهدايا" } };

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useStore();
  const category = categoryNames[slug as keyof typeof categoryNames];
  const list = category ? products.filter((product) => product.category === category.value) : products;
  const name = category?.[lang] ?? (lang === "ar" ? "مجموعة SABA" : "SABA Collection");
  return <div><div className="pattern bg-secondary px-6 py-20 text-center text-secondary-foreground"><p className="text-xs tracking-[.25em] text-primary">{lang === "ar" ? "عالم SABA" : "The world of SABA"}</p><h1 className="mt-4 text-5xl font-bold">{name}</h1><p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-background/70">{lang === "ar" ? "قطع مختارة تمزج أصالة الحرفة اليمنية مع حسّ التصميم المعاصر." : "Selected pieces blending authentic Yemeni craft with contemporary design."}</p></div><div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-16 sm:px-6 md:grid-cols-3 lg:grid-cols-4">{list.map((product) => <ProductCard key={product.slug} p={product} />)}</div></div>;
}
