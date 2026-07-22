"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Mail, Minus, Phone, Plus, Search, ShoppingBag, Trash2 } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/components/store-provider";
import { products } from "@/lib/data";

const info = {
  about: { ar: ["من سبأ إلى العالم", "قصتنا", "وُلدت SABA من إيمان عميق بأن إرث اليمن لا ينتمي إلى الماضي وحده، بل يملك مكانًا مستحقًا في قلب الفخامة المعاصرة.", "نبحث عن الحرف والمواد والروائح الأصيلة، ثم نقدمها في تجربة عالمية تحفظ روح المكان وتحترم صانعيه."], en: ["From Saba to the world", "Our story", "SABA was born from a belief that Yemeni heritage belongs not only to the past, but at the heart of contemporary luxury.", "We seek authentic craft, materials and fragrances, presenting them through a global experience that honors their makers."] },
  faq: { ar: ["أسئلة شائعة", "نحن هنا لمساعدتك", "هل منتجات SABA أصلية؟ — نعم، نختار جميع منتجاتنا من مصادر موثوقة ونضمن أصالتها.", "كم يستغرق الشحن؟ — من يومين إلى خمسة أيام عمل داخل الخليج، ويختلف دوليًا."], en: ["Frequently asked questions", "We are here to help", "Are SABA products authentic? — Yes. Every piece comes from trusted sources.", "How long does shipping take? — Two to five business days in the Gulf; international times vary."] },
  privacy: { ar: ["سياسة الخصوصية", "خصوصيتك أولًا", "نلتزم بحماية بياناتك واستخدامها فقط لتقديم وتحسين تجربتك."], en: ["Privacy policy", "Your privacy first", "We protect your information and use it only to provide and improve your experience."] },
  "shipping-returns": { ar: ["الشحن والاسترجاع", "خدمة تليق باختيارك", "نقدم شحنًا عالميًا موثوقًا مع تتبع كامل للشحنة.", "يمكن إرجاع المنتجات غير المستخدمة وفي تغليفها الأصلي خلال 14 يومًا."], en: ["Shipping & returns", "Service worthy of your choice", "We offer reliable worldwide shipping with complete tracking.", "Unused products in original packaging may be returned within 14 days."] },
};

const formFields = {
  login: { ar: ["البريد الإلكتروني", "كلمة المرور"], en: ["Email address", "Password"] },
  register: { ar: ["الاسم الكامل", "البريد الإلكتروني", "كلمة المرور"], en: ["Full name", "Email address", "Password"] },
  contact: { ar: ["الاسم", "البريد الإلكتروني", "الموضوع"], en: ["Name", "Email address", "Subject"] },
  checkout: { ar: ["الاسم الكامل", "البريد الإلكتروني", "رقم الهاتف", "العنوان", "المدينة"], en: ["Full name", "Email address", "Phone number", "Address", "City"] },
  track: { ar: ["رقم الطلب", "البريد الإلكتروني"], en: ["Order number", "Email address"] },
};

type FormKind = keyof typeof formFields;
function Form({ kind }: { kind: FormKind }) {
  const { lang } = useStore();
  const fields = formFields[kind][lang];
  const text = (ar: string, en: string) => lang === "ar" ? ar : en;
  const [sent, setSent] = useState(false);
  return <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="mx-auto flex max-w-xl flex-col gap-5">{kind === "checkout" && <div className="border border-primary bg-primary/10 p-4 text-sm">{text("الدفع في هذا الإصدار تجريبي وغير متصل ببوابة دفع.", "Checkout is a demo and is not connected to a payment gateway.")}</div>}{fields.map((field) => <label key={field} className="flex flex-col gap-2 text-sm"><span>{field}</span><input className="border bg-card px-4 py-4 outline-none focus:border-primary" required type={field.toLowerCase().includes("password") || field.includes("كلمة") ? "password" : field.toLowerCase().includes("email") || field.includes("البريد") ? "email" : "text"} /></label>)}{kind === "contact" && <label className="flex flex-col gap-2 text-sm"><span>{text("رسالتك", "Your message")}</span><textarea required className="min-h-36 border bg-card p-4 outline-none focus:border-primary" /></label>}<button className="bg-foreground px-6 py-4 font-bold text-background">{kind === "track" ? text("تتبع الطلب", "Track order") : kind === "checkout" ? text("تأكيد الطلب التجريبي", "Confirm demo order") : text("متابعة", "Continue")}</button>{sent && <p role="status" className="text-center text-sm text-primary">{text("تم استلام طلبك بنجاح.", "Your request was received successfully.")}</p>}</form>;
}

export default function Generic() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const { cart, wishlist, remove, setQuantity, lang } = useStore();
  const text = (ar: string, en: string) => lang === "ar" ? ar : en;
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const results = useMemo(() => products.filter((product) => `${product.name} ${product.nameEn} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())), [query]);

  if (slug === "cart") {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return <Page title={text("سلة التسوق", "Shopping cart")} eyebrow={text(`${cart.length} منتجات`, `${cart.length} items`)}>{cart.length ? <div className="grid gap-8 md:grid-cols-3"><div className="grid gap-5 md:col-span-2">{cart.map(({ product, quantity }) => <div key={product.slug} className="flex flex-wrap items-center gap-4 border-b pb-5 sm:flex-nowrap"><Image src={product.image} alt={lang === "ar" ? product.name : product.nameEn} width={96} height={96} className="size-24 object-cover" /><div className="min-w-32 flex-1"><Link href={`/product/${product.slug}`} className="font-bold">{lang === "ar" ? product.name : product.nameEn}</Link><div className="mt-3 flex w-fit items-center border"><button onClick={() => setQuantity(product.slug, quantity - 1)} className="grid size-9 place-items-center" aria-label={text("تقليل الكمية", "Decrease quantity")}><Minus /></button><b className="min-w-8 text-center">{quantity}</b><button onClick={() => setQuantity(product.slug, quantity + 1)} className="grid size-9 place-items-center" aria-label={text("زيادة الكمية", "Increase quantity")}><Plus /></button></div></div><b>{product.price * quantity} {text("ر.س", "SAR")}</b><button onClick={() => remove(product.slug)} className="grid size-10 place-items-center" aria-label={text("حذف المنتج", "Remove item")}><Trash2 /></button></div>)}</div><aside className="h-fit bg-card p-6"><h2 className="text-xl font-bold">{text("ملخص الطلب", "Order summary")}</h2><div className="my-5 flex justify-between"><span>{text("الإجمالي", "Total")}</span><b>{total} {text("ر.س", "SAR")}</b></div><input placeholder="WELCOME15" aria-label={text("رمز الخصم", "Coupon code")} className="w-full border p-3" /><Link href="/checkout" className="mt-3 block bg-primary p-4 text-center font-bold">{text("إتمام الشراء", "Checkout")}</Link></aside></div> : <Empty text={text("سلتك تنتظر اختياراتك الملكية", "Your cart awaits your royal selection")} />}</Page>;
  }
  if (slug === "wishlist") return <Page title={text("قائمة الأمنيات", "Wishlist")} eyebrow={text("محفوظ لك", "Saved for you")}>{wishlist.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{wishlist.map((product) => <ProductCard key={product.slug} p={product} />)}</div> : <Empty text={text("لم تضف أي قطع إلى المفضلة بعد", "You have not saved any pieces yet")} />}</Page>;
  if (slug === "search") return <Page title={text("ابحث في SABA", "Search SABA")} eyebrow={text("اكتشف كنزك", "Find your treasure")}><label className="mx-auto mb-10 flex max-w-2xl items-center gap-3 border-b border-primary py-4"><Search /><span className="sr-only">{text("بحث", "Search")}</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent text-xl outline-none" placeholder={text("اكتب اسم المنتج...", "Type a product name...")} /></label>{results.length ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{results.map((product) => <ProductCard key={product.slug} p={product} />)}</div> : <Empty text={text("لا توجد نتائج مطابقة", "No matching results")} />}</Page>;
  if (slug === "login" || slug === "register") return <Page title={slug === "login" ? text("مرحبًا بعودتك", "Welcome back") : text("انضم إلى عالم SABA", "Join the world of SABA")} eyebrow={text("حسابك", "Your account")}><Form kind={slug} /></Page>;
  if (slug === "account") return <Page title={text("حسابي", "My account")} eyebrow="SABA"><div className="mx-auto flex max-w-md flex-col gap-4 text-center"><p>{text("سجّل الدخول لعرض طلباتك وعناوينك.", "Sign in to view your orders and addresses.")}</p><Link href="/login" className="bg-foreground p-4 font-bold text-background">{text("تسجيل الدخول", "Sign in")}</Link><Link href="/register" className="border p-4">{text("إنشاء حساب", "Create account")}</Link></div></Page>;
  if (slug === "checkout") return <Page title={text("إتمام الطلب", "Checkout")} eyebrow={text("خطوة أخيرة", "One last step")}><Form kind="checkout" /></Page>;
  if (slug === "contact") return <Page title={text("تواصل معنا", "Contact us")} eyebrow={text("يسعدنا سماعك", "We would love to hear from you")}><div className="mb-10 flex flex-col justify-center gap-4 text-sm sm:flex-row sm:gap-8"><span className="flex gap-2"><Mail /> care@saba.store</span><span className="flex gap-2"><Phone /> +967 1 234 567</span></div><Form kind="contact" /></Page>;
  if (slug === "track-order") return <Page title={text("تتبع طلبك", "Track your order")} eyebrow={text("أين وصلت شحنتك؟", "Where is your shipment?")}><Form kind="track" /></Page>;
  const content = info[slug as keyof typeof info]?.[lang];
  if (content) return <Page title={content[0]} eyebrow={content[1]}><div className="mx-auto flex max-w-2xl flex-col gap-6 text-base leading-8 text-muted-foreground">{content.slice(2).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></Page>;
  notFound();
}

function Page({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) { return <div className="min-h-[65vh]"><div className="pattern bg-secondary px-6 py-16 text-center text-secondary-foreground"><p className="text-xs tracking-[.25em] text-primary">{eyebrow}</p><h1 className="mt-4 text-balance text-4xl font-bold md:text-6xl">{title}</h1></div><div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">{children}</div></div>; }
function Empty({ text }: { text: string }) { const { lang } = useStore(); return <div className="grid min-h-64 place-items-center border bg-card px-6 text-center"><div><ShoppingBag className="mx-auto mb-4 text-primary" /><p>{text}</p><Link href="/products" className="mt-4 inline-block border-b border-primary pb-1">{lang === "ar" ? "تسوق الآن" : "Shop now"}</Link></div></div>; }
