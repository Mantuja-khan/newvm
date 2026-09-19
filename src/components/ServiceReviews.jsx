import { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
import { API_BASE } from "@/config/api";
import { TextReveal } from "./TextReveal";

function storageKey(slug) {
  return `vm-reviews:${slug}`;
}

function loadReviews(slug) {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(slug));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function ServiceReviews({ slug, serviceTitle }) {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [hover, setHover] = useState(0);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews?slug=${slug}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setReviews(data);
        }
      }
    } catch (e) {
      console.error("Error fetching reviews from MongoDB:", e);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [slug]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const body = {
      name: name.trim(),
      rating,
      text: text.trim(),
      slug,
      role: "Verified Customer",
    };

    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setName("");
        setText("");
        setRating(5);
      }
    } catch (error) {
      console.error("Error submitting review to MongoDB:", error);
    }
  };

  const avg =
    reviews.length > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section className="reveal py-24 bg-surface">
      <div className="container-x grid lg:grid-cols-[1fr_1.2fr] gap-14">
        <div>
          <span className="eyebrow">Customer Reviews</span>
          <TextReveal as="h2" className="mt-3 text-3xl md:text-4xl font-bold">
            Share your experience with <span className="text-primary">{serviceTitle}</span>
          </TextReveal>
          <p className="mt-4 text-muted-foreground">
            Your feedback helps other businesses choose confidently. Rate the service and leave a
            short review below.
          </p>

          {avg && (
            <div className="mt-6 inline-flex items-center gap-3 bg-white border border-border rounded-2xl px-5 py-3">
              <div className="text-3xl font-bold text-primary">{avg}</div>
              <div>
                <div className="flex text-primary text-sm">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < Math.round(Number(avg)) ? <FaStar key={i} /> : <FaRegStar key={i} />,
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          )}

          <form
            onSubmit={submit}
            className="mt-8 bg-white border border-border rounded-2xl p-6 space-y-4"
          >
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="e.g. Rohit Sharma"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rating
              </label>
              <div className="mt-2 flex gap-1 text-2xl text-primary">
                {[1, 2, 3, 4, 5].map((n) => {
                  const active = (hover || rating) >= n;
                  return (
                    <button
                      type="button"
                      key={n}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(n)}
                      className="hover:scale-110 transition-transform"
                      aria-label={`${n} star${n === 1 ? "" : "s"}`}
                    >
                      {active ? <FaStar /> : <FaRegStar />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Review
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={4}
                className="mt-1 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                placeholder="Tell others what worked well…"
              />
            </div>
            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </form>
        </div>

        <div>
          <TextReveal as="h3" className="text-2xl font-bold">
            What customers say
          </TextReveal>
          {reviews.length === 0 ? (
            <div className="mt-6 p-8 rounded-2xl border border-dashed border-border bg-white text-center text-muted-foreground">
              No reviews yet. Be the first to share your experience!
            </div>
          ) : (
            <div className="mt-6 space-y-4 max-h-[640px] overflow-y-auto pr-2">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl p-6 border border-border shadow-[var(--shadow-soft)] animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-4xl text-primary/70" />
                    <div className="flex-1">
                      <div className="font-bold">{r.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(r.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex text-primary text-sm">
                      {Array.from({ length: 5 }).map((_, i) =>
                        i < r.rating ? <FaStar key={i} /> : <FaRegStar key={i} />,
                      )}
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
