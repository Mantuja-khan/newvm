import { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
import { API_BASE } from "@/config/api";

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
        setReviews(data);
      } else {
        setReviews(loadReviews(slug));
      }
    } catch (e) {
      setReviews(loadReviews(slug));
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
        const currentLocal = loadReviews(slug);
        localStorage.setItem(storageKey(slug), JSON.stringify([newReview, ...currentLocal]));
      } else {
        const localObj = {
          id: String(Date.now()),
          name: name.trim(),
          rating,
          text: text.trim(),
          date: new Date().toISOString().slice(0, 10),
        };
        const next = [localObj, ...reviews];
        setReviews(next);
        localStorage.setItem(storageKey(slug), JSON.stringify(next));
      }
    } catch {
      const localObj = {
        id: String(Date.now()),
        name: name.trim(),
        rating,
        text: text.trim(),
        date: new Date().toISOString().slice(0, 10),
      };
      const next = [localObj, ...reviews];
      setReviews(next);
      localStorage.setItem(storageKey(slug), JSON.stringify(next));
    }
    setName("");
    setText("");
    setRating(5);
  };

  const total = reviews.length;
  const avg = total ? (reviews.reduce((a, c) => a + c.rating, 0) / total).toFixed(1) : "5.0";

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Customer Feedback</span>
          <h3 className="text-2xl font-bold mt-1">Reviews for {serviceTitle}</h3>
        </div>
        <div className="flex items-center gap-3 bg-surface px-4 py-2 rounded-xl border border-border">
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((i) => (
              <FaStar key={i} className="text-sm" />
            ))}
          </div>
          <span className="text-sm font-bold">{avg} out of 5</span>
          <span className="text-xs text-muted-foreground">({total} reviews)</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-8 text-center bg-surface rounded-2xl border border-border text-muted-foreground text-sm">
              No reviews yet. Be the first to leave a review for {serviceTitle}!
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-5 rounded-2xl bg-white border border-border shadow-[var(--shadow-soft)]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <FaUserCircle className="text-2xl text-primary/40" />
                    <div>
                      <h4 className="font-semibold text-sm">{r.name}</h4>
                      <span className="text-[11px] text-muted-foreground">{r.date}</span>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) =>
                      star <= r.rating ? (
                        <FaStar key={star} className="text-xs" />
                      ) : (
                        <FaRegStar key={star} className="text-xs text-slate-300" />
                      )
                    )}
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mt-3">{r.text}</p>
              </div>
            ))
          )}
        </div>

        <form onSubmit={submit} className="p-6 rounded-2xl bg-surface border border-border h-fit space-y-4">
          <h4 className="font-bold text-base">Write a Review</h4>

          <div>
            <label className="block text-xs font-semibold mb-1">Your Rating</label>
            <div className="flex text-amber-400 text-xl gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  {star <= (hover || rating) ? <FaStar /> : <FaRegStar className="text-slate-300" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Your Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-border focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Your Feedback</label>
            <textarea
              required
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your experience with this service..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-border focus:outline-none focus:border-primary"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-2.5 text-xs font-bold rounded-xl">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
