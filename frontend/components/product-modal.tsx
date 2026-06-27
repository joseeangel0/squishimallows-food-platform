"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { logProductView } from "@/lib/tracking";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  images: string[] | null;
  categories: { name: string };
};

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  user_email: string;
  verified_purchase: boolean;
  created_at: string;
};

function Stars({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${interactive ? "cursor-pointer" : "cursor-default"}`}
        >
          <svg
            className={`w-5 h-5 transition-colors ${i <= (hovered || rating) ? "text-rm-amber" : "text-gray-300"}`}
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

function maskEmail(email: string) {
  const [user, domain] = email.split("@");
  return `${user[0]}***@${domain}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

interface Props {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (p: { id: string; name: string; price: number; image_url: string | null }) => void;
}

export function ProductModal({ product, open, onClose, onAddToCart }: Props) {
  const [reviews, setReviews]   = useState<Review[]>([]);
  const [rating, setRating]     = useState(0);
  const [comment, setComment]   = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg]   = useState("");
  const openedAtRef    = useRef(0);
  const addedToCartRef = useRef(false);

  useEffect(() => {
    if (open && product) {
      openedAtRef.current    = Date.now();
      addedToCartRef.current = false;
    }
  }, [open, product]);

  const images = product?.images?.length ? product.images : product?.image_url ? [product.image_url] : [];
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  useEffect(() => {
    if (!product) return;
    let mounted = true;
    fetch(`/api/reviews?product_id=${product.id}`)
      .then((r) => r.json())
      .then((data) => { if (mounted) setReviews(data); });
    return () => { mounted = false; };
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setSubmitMsg("Selecciona una calificación"); return; }
    setSubmitting(true);
    setSubmitMsg("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSubmitMsg("Inicia sesión para dejar una reseña"); setSubmitting(false); return; }

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product!.id, rating, comment }),
    });

    if (res.ok) {
      setSubmitMsg("¡Reseña publicada!");
      setRating(0);
      setComment("");
      fetch(`/api/reviews?product_id=${product!.id}`).then((r) => r.json()).then(setReviews);
    } else {
      const err = await res.json();
      setSubmitMsg(err.error ?? "Error al publicar");
    }
    setSubmitting(false);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => {
      if (!v && product) {
        const seconds = Math.round((Date.now() - openedAtRef.current) / 1000);
        logProductView(product.id, seconds, addedToCartRef.current);
      }
      if (!v) onClose();
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>

        {/* Carousel */}
        {images.length > 0 && (
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((src, i) => (
                <CarouselItem key={i}>
                  <div className="relative h-56 w-full bg-rm-purple-light">
                    <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="672px" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </>
            )}
          </Carousel>
        )}

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Product info */}
          <div>
            <span className="inline-block bg-rm-amber text-black text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
              {product.categories?.name}
            </span>
            <h2 className="text-xl font-bold text-gray-900">{product.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">${product.price} MXN</span>
            <Button className="bg-rm-purple hover:bg-rm-purple-hover text-white" onClick={() => { addedToCartRef.current = true; onAddToCart(product); onClose(); }}>
              Agregar al carrito
            </Button>
          </div>

          <hr className="border-gray-100" />

          {/* Rating summary */}
          <div className="flex items-center gap-3">
            <Stars rating={Math.round(avgRating)} />
            <span className="text-sm font-semibold text-gray-700">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</span>
            <span className="text-sm text-gray-400">({reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"})</span>
          </div>

          {/* Review form */}
          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-700">Deja tu opinión</p>
            <Stars rating={rating} interactive onChange={setRating} />
            <textarea
              placeholder="Escribe tu comentario (opcional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rm-purple resize-none"
            />
            {submitMsg && (
              <p className={`text-xs ${submitMsg.startsWith("¡") ? "text-green-600" : "text-red-500"}`}>{submitMsg}</p>
            )}
            <Button type="submit" size="sm" disabled={submitting} className="self-end bg-rm-purple hover:bg-rm-purple-hover text-white disabled:opacity-60">
              {submitting ? "Publicando..." : "Publicar"}
            </Button>
          </form>

          {/* Reviews list */}
          {reviews.length > 0 && (
            <div className="flex flex-col gap-3">
              {reviews.map((r) => (
                <div key={r.id} className="border border-gray-100 rounded-xl p-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stars rating={r.rating} />
                      {r.verified_purchase && (
                        <span className="text-xs text-green-600 font-medium">✓ Compra verificada</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">{timeAgo(r.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">{maskEmail(r.user_email)}</p>
                  {r.comment && <p className="text-sm text-gray-700">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
