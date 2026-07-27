import { createFileRoute, Link } from "@tanstack/react-router";
import { FaArrowRight, FaShoppingCart } from "react-icons/fa";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { CATEGORIES, PRODUCTS } from "@/data/site";
import { useState, useEffect } from "react";

import { API_BASE } from "@/config/api";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Software & Cloud Solutions | VM Solutiions" },
      { name: "description", content: "Genuine Tally & BUSY software and business cloud hosting plans at honest prices." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [productList, setProductList] = useState<any[]>(PRODUCTS);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProductList(data);
          }
        }
      } catch (err) {
        console.log("Could not load products from backend, using defaults.");
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <PageHero title="Our Products" crumb="Products" />

      <section className="reveal py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Shop by Category" title={<>Curated <span className="text-primary">IT Products</span></>} subtitle="Genuine software and cloud hosting plans — priced honestly, backed by real support." />

          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <a key={c.id} href={`#${c.id}`} className="px-5 py-2 rounded-full border border-border text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-colors">
                {c.name}
              </a>
            ))}
          </div>

          {CATEGORIES.map((cat) => (
            <div key={cat.id} id={cat.id} className="mt-16 scroll-mt-24">
              <h3 className="text-2xl font-bold border-l-4 border-primary pl-4">{cat.name}</h3>
              <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productList.filter((p) => p.cat === cat.id).map((p) => (
                  <div key={p.name} className="group bg-white rounded-2xl p-4 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between">
                    <div>
                      {/* Product Image */}
                      <div className="relative h-44 w-full bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-slate-300 text-xs font-semibold">No Image Available</div>
                        )}
                        <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white px-2 py-0.5 rounded-full">{p.tag}</span>
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors mt-2">{p.name}</h4>
                      
                      {/* Rating */}
                      {p.rating && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-600 text-[10px] font-bold text-white leading-none">
                            {p.rating} ★
                          </span>
                          <span className="text-[11px] font-medium text-slate-400">({p.reviewsCount} Ratings)</span>
                        </div>
                      )}

                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{p.desc}</p>
                    </div>

                    <div>
                      {/* Price Section */}
                      <div className="mt-4 flex items-baseline gap-2 flex-wrap">
                        <span className="text-lg font-bold text-slate-900">{p.price}</span>
                        {p.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">{p.originalPrice}</span>
                        )}
                        {p.discount && (
                          <span className="text-xs font-bold text-emerald-600">{p.discount}</span>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="mt-4 border-t border-slate-100 pt-3 flex justify-end">
                        {p.type === "hardware" || ["laptops", "desktops", "workstations", "accessories"].includes(p.cat) ? (
                          <Link
                            to="/hardware/$id"
                            params={{ id: p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }}
                            className="btn-primary py-1.5 px-4 text-xs font-semibold rounded-lg flex items-center gap-1"
                          >
                            View Details <FaArrowRight className="text-[9px]" />
                          </Link>
                        ) : (
                          <a
                            href={`https://wa.me/919358853990?text=${encodeURIComponent(`Hello VM Solutiions, I am interested in ${p.name} (${p.price} - ${p.tag}). Please share more details.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary py-1.5 px-4 text-xs font-semibold rounded-lg flex items-center gap-1"
                          >
                            Enquire on WhatsApp <FaArrowRight className="text-[9px]" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
