import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export type Drink = { nom: string; note: string; img: string | null };

export function DrinkCarousel({ items, label }: { items: Drink[]; label: string }) {
  const [slide, setSlide] = useState(0);
  const actif = items[slide] ?? items[0]!;

  const go = (dir: number) => setSlide((s) => (s + dir + items.length) % items.length);

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label={`${label} précédent`}
          onClick={() => go(-1)}
          className="border-b border-hairline pb-1 text-xs uppercase tracking-[0.3em] transition-colors hover:border-copper hover:text-copper"
        >
          Précédent
        </button>
        <p className="text-xs uppercase tracking-[0.3em] text-copper">
          {String(slide + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
        <button
          type="button"
          aria-label={`${label} suivant`}
          onClick={() => go(1)}
          className="border-b border-copper pb-1 text-xs uppercase tracking-[0.3em] text-copper transition-opacity hover:opacity-70"
        >
          Suivant
        </button>
      </div>

      <div className="mt-10 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.figure
            key={actif.nom}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex w-full max-w-3xl flex-col items-center text-center"
          >
            <figcaption className="text-3xl font-[600] tracking-tight sm:text-4xl">
              {actif.nom}
            </figcaption>
            <div className="mt-8 h-80 w-full overflow-hidden bg-transparent sm:h-96">
              {actif.img ? (
                <img
                  src={actif.img}
                  alt={actif.nom}
                  loading="lazy"
                  width={1280}
                  height={1920}
                  className="h-full w-full object-contain mix-blend-lighten"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    Photo à venir
                  </span>
                </div>
              )}
            </div>
            <p className="mt-6 text-base font-[200] leading-relaxed text-muted-foreground lg:text-lg">
              {actif.note}
            </p>
          </motion.figure>
        </AnimatePresence>
      </div>

      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3">
        {items.map((c, i) => (
          <li key={c.nom}>
            <button
              type="button"
              onClick={() => setSlide(i)}
              className={`text-xs uppercase tracking-[0.25em] transition-colors ${
                i === slide ? "text-copper" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.nom}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
