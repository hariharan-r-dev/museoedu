"use client";

import { useState } from "react";

export type Faq = { question: string; answer: string };

export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return <ol className="faq-list">{items.map((item,index)=>{const expanded=open===index;const panel=`faq-panel-${index}`;return <li key={item.question} className={expanded?"is-open":""}><button type="button" aria-expanded={expanded} aria-controls={panel} onClick={()=>setOpen(expanded?null:index)}><span>{String(index+1).padStart(2,"0")}</span><strong>{item.question}</strong><i aria-hidden="true">{expanded?"—":"+"}</i></button><div id={panel} className="faq-answer" hidden={!expanded}><p>{item.answer}</p></div></li>})}</ol>;
}
