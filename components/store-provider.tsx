"use client";
import {createContext,useContext,useState} from "react";import type{Product}from"@/lib/data";
type Store={lang:"ar"|"en";toggle:()=>void;cart:Product[];wishlist:Product[];add:(p:Product)=>void;wish:(p:Product)=>void};
const C=createContext<Store|null>(null);
export function StoreProvider({children}:{children:React.ReactNode}){const[lang,setLang]=useState<"ar"|"en">("ar");const[cart,setCart]=useState<Product[]>([]);const[wishlist,setWishlist]=useState<Product[]>([]);const toggle=()=>setLang(v=>v==="ar"?"en":"ar");const add=(p:Product)=>setCart(v=>[...v,p]);const wish=(p:Product)=>setWishlist(v=>v.some(x=>x.slug===p.slug)?v.filter(x=>x.slug!==p.slug):[...v,p]);return <C value={{lang,toggle,cart,wishlist,add,wish}}><div dir={lang==="ar"?"rtl":"ltr"}>{children}</div></C>};
export function useStore(){const v=useContext(C);if(!v)throw Error("StoreProvider missing");return v}
