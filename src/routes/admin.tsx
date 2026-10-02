import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { storage, auth } from "@/lib/firebase";
import { useContent } from "@/hooks/useContent";
import type { SiteContent, DrinkContent, GalleryImage } from "@/content/defaultContent";
import imageCompression from "browser-image-compression";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — Events by Cube 55" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

/* ------------------------------------------------------------------ */
/*  Reusable tiny components (inline — no external deps)               */
/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 border-b border-[#333] pb-3 text-xl font-semibold tracking-wide text-white">
      {children}
    </h2>
  );
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-medium uppercase tracking-widest text-[#aaa]">
      {children}
    </label>
  );
}

function Input({
  value,
  onChange,
  id,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-[#555] outline-none transition-colors focus:border-[#c8956c]"
    />
  );
}

function Textarea({
  value,
  onChange,
  id,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-[#555] outline-none transition-colors focus:border-[#c8956c]"
    />
  );
}

function ImagePicker({
  currentSrc,
  onPick,
  label,
}: {
  currentSrc: string;
  onPick: (dataUrl: string) => void;
  label: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    try {
      // 1. Compression de l'image (max 1Mo, max largeur 1920px, webp par défaut)
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp" as string,
      };
      
      const compressedFile = await imageCompression(file, options);
      console.log(`Image compressée : ${file.size / 1024 / 1024} MB -> ${compressedFile.size / 1024 / 1024} MB`);

      // 2. Upload sur Firebase Storage
      const storageRef = ref(storage, `images/${Date.now()}_${compressedFile.name.split('.')[0]}.webp`);
      await uploadBytes(storageRef, compressedFile);
      const url = await getDownloadURL(storageRef);
      onPick(url);
    } catch (err) {
      console.error("Erreur d'upload :", err);
      alert("Erreur lors de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {currentSrc && (
        <img
          src={currentSrc}
          alt={label}
          className="h-16 w-16 shrink-0 rounded-lg border border-[#333] object-cover"
        />
      )}
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="rounded-lg border border-[#444] bg-[#222] px-4 py-2 text-xs uppercase tracking-widest text-[#ccc] transition-colors hover:border-[#c8956c] hover:text-white disabled:opacity-50"
      >
        {uploading ? "Envoi..." : (currentSrc ? "Changer" : "Choisir")} {label}
      </button>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-8 py-3 text-sm font-semibold uppercase tracking-widest transition-all ${
        saved
          ? "bg-green-700 text-white"
          : "bg-[#c8956c] text-black hover:bg-[#dba97e]"
      }`}
    >
      {saved ? "✓ Sauvegardé !" : "Sauvegarder les modifications"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Admin Page                                                         */
/* ------------------------------------------------------------------ */

function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setAuthError("Email ou mot de passe incorrect.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const { content, setContent, resetContent, loading } = useContent();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("hero");

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] text-white">Vérification de l'accès...</div>;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] p-4 text-white">
        <form onSubmit={handleLogin} className="w-full max-w-sm rounded-xl border border-[#222] bg-[#111] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-xl font-bold tracking-tight text-[#c8956c]">Cube 55</h1>
            <p className="mt-2 text-sm text-[#888]">Espace administration</p>
          </div>
          
          {authError && <p className="mb-4 text-sm text-red-400 text-center">{authError}</p>}
          
          <div className="mb-4">
            <Label>Adresse e-mail</Label>
            <Input value={email} onChange={setEmail} placeholder="employe@exemple.com" />
          </div>
          <div className="mb-6">
            <Label>Mot de passe</Label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#333] bg-[#1a1a1a] px-4 py-2.5 text-sm text-white placeholder-[#555] outline-none transition-colors focus:border-[#c8956c]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-[#c8956c] px-4 py-3 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-[#dba97e]"
          >
            Se connecter
          </button>
        </form>
      </div>
    );
  }

  // Keep draft in sync if it's the first load
  if (!loading && draft === null) {
    setDraft({ ...content });
  }

  if (loading || !draft) {
    return <div className="flex min-h-screen items-center justify-center bg-[#0e0e0e] text-white">Chargement depuis Firebase...</div>;
  }

  // Generic updater
  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => {
    setDraft((d) => ({ ...d!, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    await setContent(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Remettre tout le contenu par défaut ? Cette action est irréversible.")) {
      resetContent();
      setDraft(null); // will trigger reload from hook
    }
  };

  /* Drink list helpers */
  const updateDrink = (
    listKey: "cocktails" | "mocktails",
    index: number,
    field: keyof DrinkContent,
    value: string,
  ) => {
    const list = [...draft[listKey]];
    list[index] = { ...list[index], [field]: value };
    set(listKey, list);
  };

  const addDrink = (listKey: "cocktails" | "mocktails") => {
    set(listKey, [...draft[listKey], { nom: "Nouveau", note: "Ingrédients…", img: "" }]);
  };

  const removeDrink = (listKey: "cocktails" | "mocktails", index: number) => {
    set(listKey, draft[listKey].filter((_, i) => i !== index));
  };

  /* Gallery helpers */
  const updateGallery = (index: number, field: keyof GalleryImage, value: string) => {
    const list = [...draft.gallery];
    list[index] = { ...list[index], [field]: value };
    set("gallery", list);
  };

  const addGallery = () => {
    set("gallery", [...draft.gallery, { src: "", alt: "Nouvelle image" }]);
  };

  const removeGallery = (index: number) => {
    set("gallery", draft.gallery.filter((_, i) => i !== index));
  };

  const tabs = [
    { id: "hero", label: "Accueil" },
    { id: "concept", label: "Concept" },
    { id: "histoire", label: "Histoire" },
    { id: "cocktails", label: "Cocktails" },
    { id: "mocktails", label: "Mocktails" },
    { id: "tarifs", label: "Tarifs" },
    { id: "galerie", label: "Galerie" },
    { id: "contact", label: "Contact" },
    { id: "footer", label: "Footer" },
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#222] bg-[#111]/95 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs uppercase tracking-widest text-[#888] transition-colors hover:text-white">
            ← Retour au site
          </a>
          <h1 className="text-lg font-bold tracking-tight">
            <span className="text-[#c8956c]">Admin</span> · Cube 55
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-[#666] hidden sm:inline-block">{user.email}</span>
          <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-[#888] transition-colors hover:text-white">
            Déconnexion
          </button>
          <div className="h-6 w-px bg-[#333] mx-2"></div>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-red-800 px-4 py-2 text-xs uppercase tracking-widest text-red-400 transition-colors hover:bg-red-900/40"
          >
            Réinitialiser
          </button>
          <SaveButton onClick={save} saved={saved} />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar tabs */}
        <nav className="sticky top-[65px] flex h-[calc(100vh-65px)] w-56 shrink-0 flex-col gap-1 overflow-y-auto border-r border-[#222] bg-[#111] p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#c8956c]/15 text-[#c8956c]"
                  : "text-[#888] hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main content area */}
        <main className="flex-1 p-8 lg:p-12">
          <div className="mx-auto max-w-3xl space-y-10">

            {/* ====== HERO ====== */}
            {activeTab === "hero" && (
              <section>
                <SectionTitle>🏠 Page d'accueil (Hero)</SectionTitle>
                <div className="space-y-6">
                  <div>
                    <Label>Sous-titre</Label>
                    <Input value={draft.heroSubtitle} onChange={(v) => set("heroSubtitle", v)} />
                  </div>
                  <div>
                    <Label>Titre principal</Label>
                    <Input value={draft.heroTitle} onChange={(v) => set("heroTitle", v)} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea value={draft.heroDescription} onChange={(v) => set("heroDescription", v)} />
                  </div>
                  <div>
                    <Label>Texte du bouton</Label>
                    <Input value={draft.heroCta} onChange={(v) => set("heroCta", v)} />
                  </div>
                  <div>
                    <Label>Image de fond</Label>
                    <ImagePicker
                      currentSrc={draft.heroImage}
                      label="image hero"
                      onPick={(url) => set("heroImage", url)}
                    />
                  </div>
                  <div>
                    <Label>Logo</Label>
                    <ImagePicker
                      currentSrc={draft.logoUrl}
                      label="logo"
                      onPick={(url) => set("logoUrl", url)}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ====== CONCEPT ====== */}
            {activeTab === "concept" && (
              <section>
                <SectionTitle>💡 Le Concept</SectionTitle>
                <div className="space-y-4">
                  {draft.conceptTexts.map((text, i) => (
                    <div key={i}>
                      <Label>Paragraphe {i + 1}</Label>
                      <Textarea
                        value={text}
                        rows={4}
                        onChange={(v) => {
                          const next = [...draft.conceptTexts];
                          next[i] = v;
                          set("conceptTexts", next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ====== HISTOIRE ====== */}
            {activeTab === "histoire" && (
              <section>
                <SectionTitle>📖 Notre Histoire</SectionTitle>
                <div className="space-y-6">
                  <div>
                    <Label>Photo</Label>
                    <ImagePicker
                      currentSrc={draft.histoireImage}
                      label="photo histoire"
                      onPick={(url) => set("histoireImage", url)}
                    />
                  </div>
                  {draft.histoireTexts.map((text, i) => (
                    <div key={i}>
                      <Label>Paragraphe {i + 1}</Label>
                      <Textarea
                        value={text}
                        rows={4}
                        onChange={(v) => {
                          const next = [...draft.histoireTexts];
                          next[i] = v;
                          set("histoireTexts", next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ====== COCKTAILS ====== */}
            {activeTab === "cocktails" && (
              <section>
                <SectionTitle>🍸 Cocktails</SectionTitle>
                <div className="mb-6">
                  <Label>Texte d'introduction</Label>
                  <Textarea value={draft.cocktailsIntro} onChange={(v) => set("cocktailsIntro", v)} />
                </div>
                <div className="space-y-6">
                  {draft.cocktails.map((drink, i) => (
                    <div key={i} className="rounded-xl border border-[#282828] bg-[#151515] p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#c8956c]">
                          Cocktail {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDrink("cocktails", i)}
                          className="text-xs text-red-400 transition-colors hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Nom</Label>
                          <Input value={drink.nom} onChange={(v) => updateDrink("cocktails", i, "nom", v)} />
                        </div>
                        <div>
                          <Label>Ingrédients</Label>
                          <Input value={drink.note} onChange={(v) => updateDrink("cocktails", i, "note", v)} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>Photo</Label>
                        <ImagePicker
                          currentSrc={drink.img}
                          label="photo"
                          onPick={(url) => updateDrink("cocktails", i, "img", url)}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDrink("cocktails")}
                    className="w-full rounded-lg border border-dashed border-[#444] py-3 text-sm text-[#888] transition-colors hover:border-[#c8956c] hover:text-[#c8956c]"
                  >
                    + Ajouter un cocktail
                  </button>
                </div>
              </section>
            )}

            {/* ====== MOCKTAILS ====== */}
            {activeTab === "mocktails" && (
              <section>
                <SectionTitle>🧃 Mocktails</SectionTitle>
                <div className="mb-6">
                  <Label>Texte d'introduction</Label>
                  <Textarea value={draft.mocktailsIntro} onChange={(v) => set("mocktailsIntro", v)} />
                </div>
                <div className="space-y-6">
                  {draft.mocktails.map((drink, i) => (
                    <div key={i} className="rounded-xl border border-[#282828] bg-[#151515] p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#c8956c]">
                          Mocktail {i + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeDrink("mocktails", i)}
                          className="text-xs text-red-400 transition-colors hover:text-red-300"
                        >
                          Supprimer
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Nom</Label>
                          <Input value={drink.nom} onChange={(v) => updateDrink("mocktails", i, "nom", v)} />
                        </div>
                        <div>
                          <Label>Ingrédients</Label>
                          <Input value={drink.note} onChange={(v) => updateDrink("mocktails", i, "note", v)} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <Label>Photo</Label>
                        <ImagePicker
                          currentSrc={drink.img}
                          label="photo"
                          onPick={(url) => updateDrink("mocktails", i, "img", url)}
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDrink("mocktails")}
                    className="w-full rounded-lg border border-dashed border-[#444] py-3 text-sm text-[#888] transition-colors hover:border-[#c8956c] hover:text-[#c8956c]"
                  >
                    + Ajouter un mocktail
                  </button>
                </div>
              </section>
            )}

            {/* ====== TARIFS ====== */}
            {activeTab === "tarifs" && (
              <section>
                <SectionTitle>💰 Tarifs</SectionTitle>
                <div className="space-y-6">
                  {draft.tarifsDescription.map((text, i) => (
                    <div key={i}>
                      <Label>Paragraphe {i + 1}</Label>
                      <Textarea
                        value={text}
                        rows={3}
                        onChange={(v) => {
                          const next = [...draft.tarifsDescription];
                          next[i] = v;
                          set("tarifsDescription", next);
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <Label>Note (variétés de cocktails)</Label>
                    <Textarea value={draft.tarifsNote} onChange={(v) => set("tarifsNote", v)} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <Label>Prix cocktail</Label>
                      <Input value={draft.prixCocktail} onChange={(v) => set("prixCocktail", v)} />
                    </div>
                    <div>
                      <Label>Prix mocktail</Label>
                      <Input value={draft.prixMocktail} onChange={(v) => set("prixMocktail", v)} />
                    </div>
                    <div>
                      <Label>Logistique</Label>
                      <Input value={draft.prixLogistique} onChange={(v) => set("prixLogistique", v)} />
                    </div>
                  </div>
                  <div>
                    <Label>Détail logistique</Label>
                    <Input value={draft.prixLogistiqueDetail} onChange={(v) => set("prixLogistiqueDetail", v)} />
                  </div>
                </div>
              </section>
            )}

            {/* ====== GALERIE ====== */}
            {activeTab === "galerie" && (
              <section>
                <SectionTitle>🖼️ Galerie</SectionTitle>
                <div className="space-y-6">
                  {draft.gallery.map((img, i) => (
                    <div key={i} className="flex items-start gap-4 rounded-xl border border-[#282828] bg-[#151515] p-4">
                      {img.src && (
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="h-24 w-24 shrink-0 rounded-lg border border-[#333] object-cover"
                        />
                      )}
                      <div className="flex-1 space-y-3">
                        <div>
                          <Label>Description (alt)</Label>
                          <Input value={img.alt} onChange={(v) => updateGallery(i, "alt", v)} />
                        </div>
                        <ImagePicker
                          currentSrc={img.src}
                          label="photo"
                          onPick={(url) => updateGallery(i, "src", url)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGallery(i)}
                        className="text-xs text-red-400 transition-colors hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addGallery}
                    className="w-full rounded-lg border border-dashed border-[#444] py-3 text-sm text-[#888] transition-colors hover:border-[#c8956c] hover:text-[#c8956c]"
                  >
                    + Ajouter une image
                  </button>
                </div>
              </section>
            )}

            {/* ====== CONTACT ====== */}
            {activeTab === "contact" && (
              <section>
                <SectionTitle>📞 Contact</SectionTitle>
                <div className="space-y-6">
                  <div>
                    <Label>Email</Label>
                    <Input value={draft.email} onChange={(v) => set("email", v)} />
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <Input value={draft.telephone} onChange={(v) => set("telephone", v)} />
                  </div>
                </div>
              </section>
            )}

            {/* ====== FOOTER ====== */}
            {activeTab === "footer" && (
              <section>
                <SectionTitle>📄 Footer / Mentions légales</SectionTitle>
                <div className="space-y-4">
                  {draft.mentionsLegales.map((text, i) => (
                    <div key={i}>
                      <Label>Ligne {i + 1}</Label>
                      <Input
                        value={text}
                        onChange={(v) => {
                          const next = [...draft.mentionsLegales];
                          next[i] = v;
                          set("mentionsLegales", next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom save button */}
            <div className="flex justify-end border-t border-[#222] pt-8">
              <SaveButton onClick={save} saved={saved} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
