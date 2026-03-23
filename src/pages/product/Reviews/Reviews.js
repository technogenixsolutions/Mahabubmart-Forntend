

"use client";
import { useEffect, useState } from "react";

function StarIcon({ filled, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#1F6BBF" : "none"} stroke={filled ? "#1F6BBF" : "#d1d5db"} strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  );
}

function StarRating({ rating, onRate, interactive = false, size = 20 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={interactive ? "cursor-pointer transition-transform hover:scale-125" : ""}
          onMouseEnter={() => interactive && setHovered(s)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(s)}
        >
          <StarIcon filled={s <= (interactive ? hovered || rating : rating)} size={size} />
        </span>
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(s => (
          <svg key={s} width={11} height={11} viewBox="0 0 24 24" fill={s <= stars ? "#1F6BBF" : "#e5e7eb"}>
            <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        ))}
      </div>
      <div className="relative flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }} />
      </div>
      <span className="w-4 text-right text-xs font-medium text-gray-400">{count}</span>
    </div>
  );
}

function Avatar({ name }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["bg-emerald-100 text-emerald-700", "bg-blue-100 text-blue-700", "bg-violet-100 text-violet-700", "bg-amber-100 text-amber-700", "bg-rose-100 text-rose-700"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${color}`}>
      {initials}
    </div>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  );
}

export default function Reviews({ product }) {
  // ── FIX 1: MongoDB uses _id not id ──
  const productId = product?._id;

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ average: 0, total: 0, distribution: [] });
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!productId) return;
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews/${productId}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setSummary(data.summary || { average: 0, total: 0, distribution: [] });
    } catch {
      setApiError("Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  // ── FIX 2: Use summary from API (not local state) ──
  const avg = summary.average || 0;
  const total = summary.total || 0;
  const dist = summary.distribution?.length
    ? summary.distribution
    : [5, 4, 3, 2, 1].map(s => ({ stars: s, count: 0 }));

  // ── FIX 3: Format MongoDB createdAt date ──
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const validate = () => {
    const e = {};
    if (!rating) e.rating = "Please select a star rating.";
    if (!title.trim()) e.title = "Title is required.";
    if (!content.trim()) e.content = "Please write your review.";
    if (!displayName.trim()) e.displayName = "Display name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setApiError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name: displayName, email, rating, title, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setShowForm(false);
      setSuccess(true);
      setRating(0); setTitle(""); setContent(""); setDisplayName(""); setEmail(""); setErrors({});
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cancel = () => {
    setShowForm(false);
    setRating(0); setTitle(""); setContent(""); setDisplayName(""); setEmail(""); setErrors({}); setApiError("");
  };

  const inputBase = [
    "w-full rounded-xl border bg-gray-50/80 px-4 py-3 text-sm text-gray-800",
    "placeholder-gray-400 transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-green-500/25 focus:border-green-400 focus:bg-white",
    "hover:border-gray-300 hover:bg-white",
  ].join(" ");

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[660px] mx-auto space-y-5">

        {/* Page Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-[#1F6BBF] text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
            </svg>
            Verified Reviews
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Reviews</h1>
          <p className="text-gray-400 text-sm mt-1.5">Real feedback from our valued customers</p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 p-6">
          {/* ── FIX 4: Show loader while fetching ── */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-[#1F6BBF] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Score Badge */}
              <div className="flex flex-col items-center justify-center min-w-[150px] bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] rounded-2xl p-6 text-white shadow-lg shadow-emerald-200">
                <span className="text-5xl font-black leading-none">{avg.toFixed(1)}</span>
                <StarRating rating={Math.round(avg)} size={16} />
                <p className="text-green-100 text-xs mt-2 font-medium">out of 5</p>
                <div className="mt-2 bg-white/20 rounded-full px-3 py-0.5">
                  <p className="text-white text-[11px] font-semibold">{total} review{total !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Distribution Bars */}
              <div className="flex-1 flex flex-col justify-center space-y-2">
                {dist.map(d => <RatingBar key={d.stars} {...d} total={total} />)}
              </div>
            </div>
          )}

          {!showForm && (
            <div className="mt-5 pt-5 border-t border-gray-50">
              <button
                onClick={() => setShowForm(true)}
                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2] text-white font-bold text-sm py-3.5 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-200/60 hover:shadow-emerald-200 active:scale-[0.98]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                </svg>
                Write a Review
              </button>
            </div>
          )}
        </div>

        {/* Success Toast */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-[#1F6BBF] flex items-center justify-center flex-shrink-0 shadow-sm shadow-emerald-200">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-[#1F6BBF] text-sm font-bold">Review submitted!</p>
              {/* ── FIX 5: Show approval message ── */}
              <p className="text-[#1F6BBF] text-xs">Thank you! It will appear after admin approval.</p>
            </div>
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/60 overflow-hidden">
            {/* Gradient Header */}
            <div className="relative bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] px-7 py-6 overflow-hidden">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full" />
              <div className="absolute -right-4 -bottom-10 w-24 h-24 bg-white/5 rounded-full" />
              <h2 className="text-white font-extrabold text-xl relative">Write a Review</h2>
              <p className="text-green-100/80 text-xs mt-0.5 relative">Your honest opinion helps others</p>
            </div>

            <div className="p-6 space-y-5">
              {/* ── FIX 6: Show API error inside form ── */}
              {apiError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {apiError}
                </div>
              )}

              {/* Star Picker */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Rating</label>
                <div className="flex items-center gap-4 bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100">
                  <StarRating rating={rating} onRate={setRating} interactive size={30} />
                  {rating > 0 && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      rating === 5 ? "bg-green-100 text-[#1F6BBF]" :
                      rating === 4 ? "bg-emerald-100 text-[#279FDF]" :
                      rating === 3 ? "bg-yellow-100 text-yellow-700" :
                      rating === 2 ? "bg-orange-100 text-orange-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                    </span>
                  )}
                </div>
                <FieldError msg={errors.rating} />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Review Title
                  <span className="ml-2 font-normal text-gray-400 text-xs">{title.length}/100</span>
                </label>
                <input
                  maxLength={100}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Give your review a title..."
                  className={`${inputBase} ${errors.title ? "!border-red-300 !bg-red-50/60" : "border-gray-200"}`}
                />
                <FieldError msg={errors.title} />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Tell others about your experience in detail..."
                  rows={4}
                  className={`${inputBase} resize-none ${errors.content ? "!border-red-300 !bg-red-50/60" : "border-gray-200"}`}
                />
                <FieldError msg={errors.content} />
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                  <input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. John Smith"
                    className={`${inputBase} ${errors.displayName ? "!border-red-300 !bg-red-50/60" : "border-gray-200"}`}
                  />
                  <FieldError msg={errors.displayName} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={`${inputBase} ${errors.email ? "!border-red-300 !bg-red-50/60" : "border-gray-200"}`}
                  />
                  <FieldError msg={errors.email} />
                </div>
              </div>

              {/* Privacy */}
              <p className="text-xs text-gray-400 leading-relaxed text-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                🔒 We'll only contact you about your review if necessary. By submitting, you agree to our{" "}
                <a href="/terms-and-conditions" className="text-[#1F6BBF] hover:underline font-medium">terms</a>,{" "}
                <a href="/privacy-policy" className="text-[#1F6BBF] hover:underline font-medium">privacy</a>
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={cancel}
                  disabled={submitting}
                  className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
                >
                  Cancel
                </button>
                {/* ── FIX 7: Submitting spinner + disabled state ── */}
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-[2] py-3.5 rounded-2xl bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2] text-white text-sm font-bold shadow-lg shadow-emerald-200/60 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              {/* ── FIX 8: Use summary.total ── */}
              <h3 className="text-sm font-bold text-gray-700">{total} Review{total !== 1 ? "s" : ""}</h3>
              <div className="w-1.5 h-1.5 rounded-full bg-[#1F6BBF]" />
            </div>
            <select className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer">
              <option>Most Recent</option>
              <option>Highest Rated</option>
              <option>Lowest Rated</option>
            </select>
          </div>

          {/* ── FIX 9: r._id instead of r.id, r.createdAt formatted ── */}
          {reviews.map((r) => (
            <div key={r._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm shadow-gray-100/80 p-5 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start gap-3.5">
                <Avatar name={r.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">{r.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={r.rating} size={13} />
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          r.rating === 5 ? "bg-green-100 text-[#1F6BBF]" :
                          r.rating >= 3 ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {["", "★", "★★", "★★★", "★★★★", "★★★★★"][r.rating]}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg flex-shrink-0">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  {r.title && <p className="mt-2.5 text-sm font-bold text-gray-800">{r.title}</p>}
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{r.content}</p>

                  {/* ── FIX 10: Show admin reply if exists ── */}
                  {r.adminReply && (
                    <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-[#1F6BBF] mb-1">Response from the store</p>
                      <p className="text-xs text-blue-700 leading-relaxed">{r.adminReply}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!loading && reviews.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-gray-500">No reviews yet</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to share your experience!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}