import { useMemo, useRef, useState } from "react";
import { apartmentTourGraph } from "../../data/media";
import type { Apartment } from "../../data/tower";
import { typeLabel } from "../../data/tower";
import { formatAed, formatSqft } from "../../lib/format";

type Props = {
  apartment: Apartment;
  lang: "ar" | "en";
  onBack: () => void;
};

/**
 * Google Street View–style room hopping: drag to look around,
 * click hotspots to walk into the next room with a soft crossfade.
 */
export default function ApartmentTour({ apartment, lang, onBack }: Props) {
  const [roomId, setRoomId] = useState("living");
  const [yaw, setYaw] = useState(0);
  const [fade, setFade] = useState(1);
  const drag = useRef<{ x: number; yaw: number } | null>(null);

  const room = useMemo(
    () => apartmentTourGraph.find((r) => r.id === roomId) ?? apartmentTourGraph[0],
    [roomId],
  );

  function goTo(next: string) {
    setFade(0);
    window.setTimeout(() => {
      setRoomId(next);
      setYaw(0);
      setFade(1);
    }, 220);
  }

  return (
    <div className="relative h-[min(82vh,760px)] w-full overflow-hidden bg-ink select-none">
      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ opacity: fade, transition: "opacity 220ms ease" }}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, yaw };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          setYaw(drag.current.yaw + dx * 0.12);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <img
          src={room.image}
          alt={lang === "ar" ? room.labelAr : room.labelEn}
          draggable={false}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[120%] w-[140%] max-w-none object-cover"
          style={{
            transform: `translate(-50%, -50%) translateX(${yaw}px) scale(1.08)`,
          }}
        />

        {room.links.map((link) => (
          <button
            key={`${room.id}-${link.to}`}
            type="button"
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${link.x}%`, top: `${link.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              goTo(link.to);
            }}
          >
            <span className="relative flex h-12 w-12 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/40" />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ink/80 text-lg text-gold ring-2 ring-gold shadow-gold">
                ▾
              </span>
            </span>
            <span className="mt-1 block rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-bold text-cream">
              {lang === "ar" ? link.labelAr : link.labelEn}
            </span>
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 bg-gradient-to-b from-ink/85 to-transparent p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gold">
            {lang === "ar" ? `شقة ${apartment.unit}` : `Apt ${apartment.unit}`} ·{" "}
            {lang === "ar" ? room.labelAr : room.labelEn}
          </p>
          <p className="mt-1 text-sm text-cream/80">
            {lang === "ar"
              ? "اسحب للنظر · اضغط الأسهم للتنقّل بين الغرف مثل خرائط جوجل"
              : "Drag to look · tap arrows to walk room-to-room like Street View"}
          </p>
        </div>
        <button type="button" onClick={onBack} className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink">
          {lang === "ar" ? "رجوع للممر" : "Back to corridor"}
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink via-ink/85 to-transparent p-4 pt-16">
        <div className="mx-auto flex max-w-4xl flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-2xl font-bold text-cream">
              {typeLabel(apartment.type, lang)} · {formatAed(apartment.priceAed, lang)}
            </p>
            <p className="text-sm text-cream/70">
              {formatSqft(apartment.sizeSqft, lang)} ·{" "}
              {lang === "ar" ? apartment.viewAr : apartment.viewEn}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {apartmentTourGraph.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => goTo(r.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  r.id === roomId ? "bg-gold text-ink" : "bg-cream/10 text-cream ring-1 ring-cream/20"
                }`}
              >
                {lang === "ar" ? r.labelAr : r.labelEn}
              </button>
            ))}
          </div>
          <a
            href={`https://wa.me/9718005454?text=${encodeURIComponent(
              lang === "ar"
                ? `مرحباً، مهتم بشقة ${apartment.unit} طابق ${apartment.floor} ببرج الوطن.`
                : `Hello, interested in apt ${apartment.unit} floor ${apartment.floor} at Al Watan Tower.`,
            )}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-ink"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
