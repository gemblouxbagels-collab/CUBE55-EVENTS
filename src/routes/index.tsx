import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useContent } from "@/hooks/useContent";
import { Reveal } from "@/components/Reveal";
import { DrinkCarousel } from "@/components/DrinkCarousel";

export const Route = createFileRoute("/")(
  {
  head: () => ({
    meta: [
      { title: "Events by Cube 55 — Bar à cocktails mobile" },
      {
        name: "description",
        content:
          "Events by Cube 55 : bar à cocktails mobile pour mariages, anniversaires et afterworks. Cocktails d'auteur, mocktails, barmans pros, devis sur mesure.",
      },
      { property: "og:title", content: "Events by Cube 55 — Bar à cocktails mobile" },
      {
        property: "og:description",
        content: "Un vrai bar à cocktails, directement chez vous. Devis sur mesure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navLinks = [
  { href: "#concept", label: "Concept" },
  { href: "#histoire", label: "Histoire" },
  { href: "#cocktails", label: "Carte" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#contact", label: "Contact" },
];

function Index() {
  const { content } = useContent();
  const [envoye, setEnvoye] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrollY(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const viewport = typeof window === "undefined" ? 800 : window.innerHeight;
  const heroOpacity = Math.max(0, 1 - scrollY / (viewport * 0.8));

  return (
    <main className="snap-y snap-proximity bg-background text-foreground">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
        <div className="relative flex items-center justify-between px-6 py-4 sm:px-12 lg:px-20">
          <a href="#accueil" className="flex items-center gap-3">
            <img
              src={content.logoUrl}
              alt="Logo Events by Cube 55"
              width={600}
              height={422}
              className="h-12 w-auto object-contain"
            />
          </a>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
            {navLinks.map((lien) => (
              <a
                key={lien.href}
                href={lien.href}
                className="text-base font-normal tracking-normal text-white transition-colors duration-300 hover:text-copper lg:text-lg"
              >
                {lien.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={menuOuvert}
            onClick={() => setMenuOuvert((v) => !v)}
            className="flex flex-col items-end gap-1.5 p-2 md:hidden"
          >
            <span className="block h-px w-6 bg-white" />
            <span className="block h-px w-4 bg-white" />
          </button>
        </div>

        {menuOuvert ? (
          <nav className="flex flex-col gap-1 border-t border-white/10 bg-black/90 px-6 pb-6 pt-2 backdrop-blur-md sm:px-12 md:hidden">
            {navLinks.map((lien) => (
              <a
                key={lien.href}
                href={lien.href}
                onClick={() => setMenuOuvert(false)}
                className="py-3 text-base font-normal tracking-normal text-white transition-colors hover:text-copper"
              >
                {lien.label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>

      {/* Hero */}
      <section
        id="accueil"
        className="relative flex min-h-screen snap-start flex-col items-center justify-center overflow-hidden text-center"
      >
        <img
          src={content.heroImage}
          alt="Bar mobile Events by Cube 55 au coucher du soleil"
          width={1440}
          height={1920}
          className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
          style={{
            opacity: heroOpacity,
            transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(1.08)`,
          }}
        />
        <div className="absolute inset-0 bg-black/20" style={{ opacity: heroOpacity }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        <div className="fade-rise relative flex w-full flex-col items-center px-6 sm:px-12 lg:px-20">
          <p
            className="text-sm font-bold uppercase tracking-widest text-[#FFD2A1] lg:text-base"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.95), 0 2px 12px rgba(0,0,0,0.85)" }}
          >
            {content.heroSubtitle}
          </p>
          <h1 className="mt-8 max-w-4xl font-serif text-5xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-xl sm:text-6xl lg:text-7xl">
            {content.heroTitle}
          </h1>
          <p className="mt-8 max-w-xl text-lg font-medium leading-relaxed text-white drop-shadow-lg lg:text-xl">
            {content.heroDescription}
          </p>
          <a
            href="#contact"
            className="mt-12 inline-block border border-copper bg-copper px-10 py-4 text-xs uppercase tracking-[0.3em] text-background transition-opacity hover:opacity-80"
          >
            {content.heroCta}
          </a>
        </div>
      </section>

      {/* Le concept */}
      <section id="concept" className="snap-start bg-black px-6 py-28 sm:px-12 lg:px-20 lg:py-40">
        <Reveal>
          <div className="mx-auto max-w-3xl space-y-8 text-center text-base font-[200] leading-relaxed text-muted-foreground lg:text-lg">
            <p className="tracking-widest-xl text-xs uppercase text-copper">Le concept</p>
            {content.conceptTexts.map((text, i) => (
              <p key={i}>{text}</p>
            ))}
          </div>
        </Reveal>
      </section>


      {/* Notre histoire */}
      <section
        id="histoire"
        className="snap-start bg-black px-6 py-28 sm:px-12 lg:px-20 lg:py-40"
      >
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <header className="flex items-baseline justify-between border-b border-hairline pb-6">
              <h2 className="text-2xl font-[200] uppercase tracking-[0.2em]">Notre histoire</h2>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">01</span>
            </header>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <Reveal>
            <img
              src={content.histoireImage}
              alt="Daniel en pleine préparation de cocktails lors d'un événement"
              loading="lazy"
              width={886}
              height={1920}
              className="h-[32rem] w-full object-cover object-center opacity-85 grayscale contrast-125 sm:h-[40rem]"
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 14%, black 72%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 14%, black 72%, transparent 100%), linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in" as any,
              }}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-6 text-left">
              <h3 className="font-serif text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Notre Histoire
              </h3>
            <div className="space-y-5 text-left text-lg font-[200] leading-relaxed text-gray-300">
              {content.histoireTexts.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
            </div>
          </Reveal>
          </div>
        </div>
      </section>

      {/* Cocktails */}
      <section
        id="cocktails"
        className="snap-start px-6 py-28 sm:px-12 lg:px-20 lg:py-40"
      >
        <Reveal>
          <header className="flex items-baseline justify-between border-b border-hairline pb-6">
            <h2 className="text-2xl font-[200] uppercase tracking-[0.2em]">Cocktails</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">02</span>
          </header>
          <p className="mt-8 max-w-3xl text-base font-[200] leading-relaxed text-muted-foreground lg:text-lg">
            {content.cocktailsIntro}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <DrinkCarousel items={content.cocktails} label="Cocktail" />
        </Reveal>
      </section>

      {/* Mocktails */}
      <section
        id="mocktails"
        className="snap-start px-6 py-28 sm:px-12 lg:px-20 lg:py-40"
      >
        <Reveal>
          <header className="flex items-baseline justify-between border-b border-hairline pb-6">
            <h2 className="text-2xl font-[200] uppercase tracking-[0.2em]">Mocktails</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">03</span>
          </header>
          <p className="mt-8 max-w-3xl text-base font-[200] leading-relaxed text-muted-foreground lg:text-lg">
            {content.mocktailsIntro}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <DrinkCarousel items={content.mocktails} label="Mocktail" />
        </Reveal>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="snap-start px-6 py-28 sm:px-12 lg:px-20 lg:py-40">
        <Reveal>
          <header className="flex items-baseline justify-between border-b border-hairline pb-6">
            <h2 className="text-2xl font-[200] uppercase tracking-[0.2em]">Tarifs</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">04</span>
          </header>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="space-y-5 text-base font-[200] leading-relaxed text-muted-foreground lg:text-lg">
              <p className="text-xl text-foreground">
                Votre événement, vos règles : on s'adapte à tout.
              </p>
              {content.tarifsDescription.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
              <ul className="space-y-4 border-t border-hairline pt-6 text-foreground">
                <li className="flex gap-4">
                  <span className="text-copper">—</span>
                  <span>{content.tarifsNote}</span>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
            <div className="border border-hairline p-10">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Tarification de base
              </p>
              <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
                <div>
                  <p className="text-4xl font-[200] leading-none tracking-tight text-copper lg:text-5xl">
                    {content.prixCocktail}
                  </p>
                  <p className="mt-3 text-sm font-[200] text-muted-foreground">par cocktail</p>
                </div>
                <div>
                  <p className="text-4xl font-[200] leading-none tracking-tight text-copper lg:text-5xl">
                    {content.prixMocktail}
                  </p>
                  <p className="mt-3 text-sm font-[200] text-muted-foreground">par mocktail</p>
                </div>
                <div>
                  <p className="text-4xl font-[200] leading-none tracking-tight text-copper lg:text-5xl">
                    {content.prixLogistique}
                  </p>
                  <p className="mt-3 text-sm font-[200] leading-relaxed text-muted-foreground">
                    {content.prixLogistiqueDetail}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Galerie */}
      <section id="galerie" className="snap-start px-6 py-28 sm:px-12 lg:px-20 lg:py-40">
        <Reveal>
          <header className="flex items-baseline justify-between border-b border-hairline pb-6">
            <h2 className="text-2xl font-[200] uppercase tracking-[0.2em]">Galerie</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">05</span>
          </header>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {content.gallery.map((g) => (
              <img
                key={g.alt}
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="w-full break-inside-avoid object-cover opacity-90 transition-opacity duration-700 hover:opacity-100"
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Contact */}
      <section id="contact" className="snap-start px-6 py-28 sm:px-12 lg:px-20 lg:py-40">
        <Reveal>
          <header className="flex items-baseline justify-between border-b border-hairline pb-6">
            <h2 className="text-2xl font-[200] uppercase tracking-[0.2em]">Contact & devis</h2>
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">06</span>
          </header>
        </Reveal>

        <Reveal>
          <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Mail</p>
              <a
                href={`mailto:${content.email}`}
                className="mt-2 block text-xl font-[200] transition-colors hover:text-copper"
              >
                {content.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Téléphone</p>
              <a
                href={`tel:${content.telephone.replace(/\s/g, "")}`}
                className="mt-2 block text-xl font-[200] transition-colors hover:text-copper"
              >
                {content.telephone}
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            className="mt-16 grid max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setEnvoye(true);
            }}
          >
            <label className="block">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Prénom</span>
              <input required type="text" name="prenom" maxLength={100} className="field-line mt-2 text-lg font-[200]" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Nom</span>
              <input required type="text" name="nom" maxLength={100} className="field-line mt-2 text-lg font-[200]" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Téléphone</span>
              <input required type="tel" name="telephone" maxLength={30} className="field-line mt-2 text-lg font-[200]" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Email</span>
              <input required type="email" name="email" maxLength={255} className="field-line mt-2 text-lg font-[200]" />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Nombre d'invités
              </span>
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                min={1}
                max={1000}
                step={1}
                name="invites"
                className="field-line mt-2 text-lg font-[200]"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Date</span>
              <input type="date" name="date" className="field-line mt-2 text-lg font-[200]" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Votre projet</span>
              <textarea
                rows={3}
                name="message"
                maxLength={1000}
                placeholder="Veuillez préciser les cocktails souhaités ainsi que le nombre total de cocktails pour votre événement."
                className="field-line field-line-placeholder mt-2 resize-none text-lg font-[200]"
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="border border-copper bg-copper px-10 py-4 text-xs uppercase tracking-[0.3em] text-background transition-opacity hover:opacity-80"
              >
                Envoyer la demande
              </button>
              {envoye && (
                <p className="mt-6 text-base text-muted-foreground">
                  Demande reçue. Nous revenons vers vous sous 24 h.
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline px-6 py-14 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <div>
            <img
              src={content.logoUrl}
              alt="Logo Events by Cube 55"
              loading="lazy"
              width={600}
              height={422}
              className="h-14 w-auto object-contain"
            />
            <p className="mt-4 text-base font-[200]">EventsbyCube55</p>
            <p className="mt-1 text-base font-[200] text-muted-foreground">Bar à domicile</p>
          </div>
          <div className="text-sm font-[200] text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em]">Mentions légales</p>
            {content.mentionsLegales.map((line, i) => (
              <p key={i} className={i === 0 ? "mt-3" : "mt-1"}>{line}</p>
            ))}
          </div>
          <div className="text-sm font-[200] text-muted-foreground">
            <p className="text-xs uppercase tracking-[0.3em]">Contact</p>
            <p className="mt-3">{content.email}</p>
            <p className="mt-1">{content.telephone}</p>
          </div>
        </div>
        <p className="mt-10 border-t border-hairline pt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          © {new Date().getFullYear()} Events by Cube 55 · L'abus d'alcool est dangereux pour la santé
        </p>
      </footer>
    </main>
  );
}
