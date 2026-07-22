"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Camera, Globe, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useStore } from "./store-provider";

const nav = [
  { ar: "الرئيسية", en: "Home", href: "/" },
  { ar: "المتجر", en: "Shop", href: "/products" },
  { ar: "العطور", en: "Perfumes", href: "/category/perfumes" },
  { ar: "المجوهرات", en: "Jewelry", href: "/category/jewelry" },
  { ar: "الهدايا", en: "Gifts", href: "/category/gifts" },
  { ar: "قصتنا", en: "Our Story", href: "/about" },
];

export function Header() {
  const { lang, toggle, cartCount, wishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchInput = useRef<HTMLInputElement>(null);
  const text = (ar: string, en: string) => lang === "ar" ? ar : en;

  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    document.body.style.overflow = "hidden";
    const close = (event: KeyboardEvent) => event.key === "Escape" && (setMenuOpen(false), setSearchOpen(false));
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [menuOpen, searchOpen]);
  useEffect(() => { if (searchOpen) searchInput.current?.focus(); }, [searchOpen]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  }

  return <>
    <div className="bg-foreground px-4 py-2 text-center text-xs text-background">{text("شحن مجاني للطلبات فوق 500 ر.س — استخدم الرمز WELCOME15", "Free shipping over SAR 500 — use WELCOME15")}</div>
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:px-8">
        <button onClick={() => setMenuOpen(true)} className="grid size-10 place-items-center lg:hidden" aria-label={text("فتح القائمة", "Open menu")} aria-expanded={menuOpen}><Menu /></button>
        <nav className="hidden items-center gap-6 text-sm lg:flex">{nav.slice(0, 3).map((item) => <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">{item[lang]}</Link>)}</nav>
        <Link href="/" className="shrink-0 text-center" aria-label="SABA Home"><span className="musnad block font-serif text-3xl font-bold">SABA</span><span className="text-[9px] tracking-[.35em] text-muted-foreground">{text("مملكة الفخامة", "KINGDOM OF LUXURY")}</span></Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={toggle} className="grid size-10 place-items-center text-xs font-bold" aria-label={text("Switch to English", "التبديل إلى العربية")}>{lang === "ar" ? "EN" : "ع"}</button>
          <button onClick={() => setSearchOpen(true)} className="grid size-10 place-items-center" aria-label={text("البحث", "Search")}><Search /></button>
          <Link href="/account" className="hidden sm:grid sm:size-10 sm:place-items-center" aria-label={text("الحساب", "Account")}><User /></Link>
          <Link href="/wishlist" className="relative grid size-10 place-items-center" aria-label={text("المفضلة", "Wishlist")}><Heart /><b className="absolute end-0 top-0 text-[9px] text-primary">{wishlist.length}</b></Link>
          <Link href="/cart" className="relative grid size-10 place-items-center" aria-label={text("السلة", "Cart")}><ShoppingBag /><b className="absolute end-0 top-0 text-[9px] text-primary">{cartCount}</b></Link>
        </div>
      </div>
      <nav className="mx-auto hidden max-w-7xl justify-center gap-9 border-t px-4 py-3 text-xs lg:flex">{nav.slice(3).map((item) => <Link key={item.href} href={item.href} className="hover:text-primary">{item[lang]}</Link>)}</nav>
    </header>

    {menuOpen && <div className="fixed inset-0 z-50 bg-foreground/60 lg:hidden" onClick={() => setMenuOpen(false)}><nav onClick={(event) => event.stopPropagation()} className="flex h-full w-[min(84vw,360px)] flex-col gap-2 bg-background p-6 shadow-xl"><div className="mb-6 flex items-center justify-between"><span className="musnad font-serif text-2xl font-bold">SABA</span><button onClick={() => setMenuOpen(false)} className="grid size-10 place-items-center" aria-label={text("إغلاق القائمة", "Close menu")}><X /></button></div>{nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="border-b py-4 text-lg">{item[lang]}</Link>)}<Link href="/account" onClick={() => setMenuOpen(false)} className="py-4">{text("حسابي", "My account")}</Link></nav></div>}

    {searchOpen && <div className="fixed inset-0 z-50 bg-foreground/70 px-4 pt-20" onClick={() => setSearchOpen(false)}><div onClick={(event) => event.stopPropagation()} className="mx-auto max-w-2xl bg-background p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><b>{text("ابحث في SABA", "Search SABA")}</b><button onClick={() => setSearchOpen(false)} aria-label={text("إغلاق البحث", "Close search")}><X /></button></div><form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-primary"><Search /><input ref={searchInput} value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent py-4 outline-none" placeholder={text("عطر، مجوهرات، هدية...", "Perfume, jewelry, gift...")} /><button className="font-bold">{text("بحث", "Search")}</button></form></div></div>}
  </>;
}

const footerGroups = [
  { ar: "تسوق", en: "Shop", links: [{ ar: "كل المنتجات", en: "All products", href: "/products" }, { ar: "العطور", en: "Perfumes", href: "/category/perfumes" }, { ar: "المجوهرات", en: "Jewelry", href: "/category/jewelry" }, { ar: "الهدايا", en: "Gifts", href: "/category/gifts" }] },
  { ar: "المساعدة", en: "Help", links: [{ ar: "الأسئلة الشائعة", en: "FAQ", href: "/faq" }, { ar: "الشحن والاسترجاع", en: "Shipping & returns", href: "/shipping-returns" }, { ar: "تتبع الطلب", en: "Track order", href: "/track-order" }, { ar: "تواصل معنا", en: "Contact us", href: "/contact" }] },
];

export function Footer() {
  const { lang } = useStore();
  const text = (ar: string, en: string) => lang === "ar" ? ar : en;
  return <footer className="pattern bg-foreground text-background"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4"><div><Link href="/" className="musnad font-serif text-4xl text-primary">SABA</Link><p className="mt-5 text-sm leading-7 text-background/70">{text("نروي إرث اليمن بمنتجات أصيلة، مصاغة للحياة المعاصرة ومختارة بمعيار ملكي.", "Authentic Yemeni heritage, curated to a royal standard for contemporary life.")}</p></div>{footerGroups.map((group) => <div key={group.en}><h3 className="mb-5 text-primary">{group[lang]}</h3><ul className="flex flex-col gap-3 text-sm text-background/70">{group.links.map((item) => <li key={item.href}><Link href={item.href} className="hover:text-primary">{item[lang]}</Link></li>)}</ul></div>)}<div><h3 className="mb-5 text-primary">{text("رسائل من سبأ", "Letters from Saba")}</h3><p className="mb-4 text-sm text-background/70">{text("كن أول من يكتشف الإصدارات والحكايات الجديدة.", "Discover new releases and stories first.")}</p><form onSubmit={(event) => event.preventDefault()} className="flex border-b border-primary"><input type="email" required className="w-full bg-transparent py-3 text-sm outline-none" placeholder={text("بريدك الإلكتروني", "Your email")} aria-label={text("البريد الإلكتروني", "Email address")} /><button>{text("اشترك", "Join")}</button></form><div className="mt-6 flex gap-4"><Camera /><Globe /></div></div></div><div className="border-t border-background/15 px-6 py-6 text-center text-xs text-background/50">© 2026 SABA — {text("جميع الحقوق محفوظة", "All rights reserved")}</div></footer>;
}
