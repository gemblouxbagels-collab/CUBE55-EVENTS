// Default content for the site — this is the initial data that populates localStorage.
// When the admin edits content, only the localStorage copy is updated.

import heroBarClean from "@/assets/hero-cube55-clean.jpg";
import logoCube from "@/assets/logo-cube55.png.asset.json";
import histoireDaniel from "@/assets/histoire-daniel.png.asset.json";
import blueLagoon from "@/assets/BLUE_LAGOON.jpg.asset.json";
import blackViper from "@/assets/Black_Viper.jpg.asset.json";
import deadPassion from "@/assets/DEAD_PASSION-2.jpg.asset.json";
import mojitoFraise from "@/assets/MOJITO_FRAISE.jpg.asset.json";
import armagedon from "@/assets/Armagedon.jpg.asset.json";
import cubaLibre from "@/assets/Cuba_libre.jpg.asset.json";
import mojito from "@/assets/Mojito_copy.jpg.asset.json";
import mojitoPassion from "@/assets/Mojito_Passion_copy.jpg.asset.json";
import spritz from "@/assets/Spritz.jpg.asset.json";
import placeToBe from "@/assets/The_place_to_be.jpg.asset.json";
import mkAfterglow from "@/assets/mk-afterglow.jpg.asset.json";
import mkMojito from "@/assets/mk-mojito.jpg.asset.json";
import mkMojitoFraise from "@/assets/mk-mojito-fraise.jpg.asset.json";
import mkMojitoPassion from "@/assets/mk-mojito-passion.jpg.asset.json";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";

export interface DrinkContent {
  nom: string;
  note: string;
  img: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface SiteContent {
  // Hero
  heroImage: string;
  logoUrl: string;
  heroSubtitle: string;
  heroTitle: string;
  heroDescription: string;
  heroCta: string;

  // Concept
  conceptTexts: string[];

  // Histoire
  histoireImage: string;
  histoireTexts: string[];

  // Cocktails
  cocktailsIntro: string;
  cocktails: DrinkContent[];

  // Mocktails
  mocktailsIntro: string;
  mocktails: DrinkContent[];

  // Tarifs
  tarifsDescription: string[];
  tarifsNote: string;
  prixCocktail: string;
  prixMocktail: string;
  prixLogistique: string;
  prixLogistiqueDetail: string;

  // Contact
  email: string;
  telephone: string;

  // Galerie
  gallery: GalleryImage[];

  // Footer
  mentionsLegales: string[];
}

export const DEFAULT_CONTENT: SiteContent = {
  // Hero
  heroImage: heroBarClean,
  logoUrl: logoCube.url,
  heroSubtitle: "Events by Cube 55 — Bar mobile",
  heroTitle: "Un vrai bar à cocktails, directement chez vous.",
  heroDescription:
    "Amenez l'expertise et l'effervescence d'un véritable établissement sur le lieu de votre événement.",
  heroCta: "Réaliser un devis",

  // Concept
  conceptTexts: [
    "Pourquoi se déplacer quand le bar peut venir à vous ? Amener l'effervescence et la qualité d'un véritable établissement directement sur votre événement, c'est notre spécialité.",
    "Avec Events by Cube 55, on charge notre bar mobile, on prend nos meilleures recettes, et on débarque là où vous faites la fête. Que ce soit pour un anniversaire, un mariage convivial ou un afterwork pour décompresser au bureau, on s'occupe de tout : les glaçons, les shakers, les sourires et le nettoyage.",
    "Vous n'avez plus qu'à trinquer et profiter de vos invités avec un vrai bon cocktail à la main. Zéro stress, 100 % plaisir.",
  ],

  // Histoire
  histoireImage: histoireDaniel.url,
  histoireTexts: [
    "Events by Cube 55, c'est la mise en lumière d'un service qui existait déjà au sein de notre établissement, mais qui restait jusqu'ici dans l'ombre. Après cinq années passées derrière le comptoir du Cube 55 à Gembloux, j'ai décidé de prendre ce concept en main pour lui donner la place qu'il mérite.",
    "Face à la demande récurrente de nos clients qui souhaitaient recréer l'expérience de notre bar pour leurs événements privés ou d'entreprise, il était temps de structurer cette offre.",
    "Ma mission est simple : amener l'expertise, la rigueur et l'énergie d'un véritable établissement professionnel directement chez vous. Plus qu'une simple livraison de boissons, c'est toute l'expérience du bar qui se déplace sur le lieu de votre célébration.",
  ],

  // Cocktails
  cocktailsIntro:
    "Une envie spécifique en dehors de cette liste ? N'hésitez pas à nous en parler : nous faisons toujours de notre mieux pour adapter notre offre à vos demandes.",
  cocktails: [
    { nom: "Dead passion", note: "Rhum brun, Lime, coulis passion, ginger beer", img: deadPassion.url },
    { nom: "Cuba libre", note: "Rhum brun, Lime, sucre de canne, coca-cola", img: cubaLibre.url },
    { nom: "Mojito", note: "Rhum brun, menthe, Lime, sucre de canne, eau pétillante", img: mojito.url },
    { nom: "Mojito Fraise", note: "Rhum brun, menthe, Lime, coulis de fraise, eau pétillante", img: mojitoFraise.url },
    { nom: "Mojito Passion", note: "Rhum brun, menthe, Lime, coulis de passion, eau pétillante", img: mojitoPassion.url },
    { nom: "Spritz 55", note: "Bitter, Liqueur de mandarine, sirop de pamplemousse, eau pétillante, cava", img: spritz.url },
    { nom: "Armagedon", note: "Vodka, liqueur de fleur de sureau, jus de cranberry, barbe à papa", img: armagedon.url },
    { nom: "The place to be", note: "Vodka, gin, sirop de pamplemousse, Lime, fever tree raspberry & rhubarb", img: placeToBe.url },
    { nom: "Black viper", note: "Vodka noire, sirop de cassis, Lime, coca-cola", img: blackViper.url },
    { nom: "Blue lagoon", note: "Vodka, curaçao, sprite", img: blueLagoon.url },
  ],

  // Mocktails
  mocktailsIntro:
    "Sans alcool, mais avec le même soin : nos mocktails sont pensés pour que tout le monde trinque avec un verre à la hauteur.",
  mocktails: [
    { nom: "Afterglow", note: "Jus d'orange, jus d'ananas, grenadine", img: mkAfterglow.url },
    { nom: "Mojito zero", note: "Lime, menthe, sucre de canne, sprite", img: mkMojito.url },
    { nom: "Mojito zero Fraise", note: "Lime, menthe, sucre de canne, eau pétillante, coulis fraise", img: mkMojitoFraise.url },
    { nom: "Mojito zero Passion", note: "Lime, menthe, sucre de canne, eau pétillante, coulis passion", img: mkMojitoPassion.url },
  ],

  // Tarifs
  tarifsDescription: [
    "Parce qu'une fête dans un jardin ne s'organise pas comme un gros afterwork d'entreprise, chaque prestation est pensée 100 % sur mesure. Que vous soyez 10 pour une soirée intime ou 150 pour un mariage, on ajuste la formule ensemble.",
    "On définit le volume exact de cocktails qu'il vous faut, on s'adapte au lieu de votre événement, et on prévoit le nombre de barmans nécessaires derrière le comptoir pour que personne ne meure de soif en attendant son verre.",
    "Pour vous donner un ordre d'idée, vous trouverez une tarification de base sur notre site. Mais comme chaque fête est unique, on prend toujours le temps d'en discuter avec vous pour tailler un devis sur mesure qui colle parfaitement à vos besoins, sans mauvaises surprises.",
  ],
  tarifsNote:
    "Un nombre maximum de variétés de cocktails peut être choisi pour votre événement (note : les différentes variantes de Mojitos comptent pour 1 seul choix).",
  prixCocktail: "9,50€",
  prixMocktail: "7,50€",
  prixLogistique: "Sur devis",
  prixLogistiqueDetail: "Logistique & barmans (100€ à 250€ selon distance et équipe)",

  // Contact
  email: "EventbyCube55@gmail.com",
  telephone: "+32 485 20 20 38",

  // Galerie
  gallery: [
    { src: gallery1, alt: "Barman mélangeant un cocktail" },
    { src: gallery2, alt: "Étagère de bouteilles anciennes" },
    { src: gallery3, alt: "Glace sphérique et zeste d'agrume" },
    { src: gallery4, alt: "Silhouettes d'invités à la bougie" },
    { src: gallery5, alt: "Cocktail fumé sous cloche" },
  ],

  // Footer
  mentionsLegales: [
    "Events by Cube 55 — Belgique",
    "Numéro d'entreprise (BCE) : BE 0000.000.000",
    "TVA : à compléter",
    "Éditeur responsable : Daniel Nazokkar",
  ],
};
