export type EditorialImage = {
  id: string;
  title: string;
  source: "Wikimedia Commons" | "Library of Congress" | "NASA" | "NOAA" | "Other";
  imageUrl: string;
  credit: string;
  license: string;
  sourceUrl: string;
  relatedInterventionId?: string;
  caption: string;
  whyItBelongs: string;
  presentation?: "photograph" | "diagram" | "data";
};

export const editorialImages: EditorialImage[] = [
  {
    id: "ecostress-las-vegas-surface-heat",
    title: "NASA's ECOSTRESS sees Las Vegas streets turn up the heat",
    source: "NASA",
    imageUrl: "https://d2pn8kiwq2w21t.cloudfront.net/original_images/jpegPIA24988.jpg",
    credit: "NASA/JPL-Caltech",
    license: "JPL public image use policy",
    sourceUrl:
      "https://www.jpl.nasa.gov/images/pia24988-nasas-ecostress-sees-las-vegas-streets-turn-up-the-heat",
    relatedInterventionId: "cool-pavements",
    caption:
      "ECOSTRESS land-surface temperature observations make the heat of streets and hard surfaces visible as measured evidence.",
    whyItBelongs:
      "It supports the surface-cooling catalogue with instrument data rather than generic heat imagery.",
    presentation: "data"
  },
  {
    id: "solar-canopy-winona-state",
    title: "Solar canopy, Winona State University",
    source: "Wikimedia Commons",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Solar_canopy_Winona_State_01.jpg/1280px-Solar_canopy_Winona_State_01.jpg",
    credit: "Wikideas1",
    license: "CC0 1.0 Universal Public Domain Dedication",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Solar_canopy_Winona_State_01.jpg",
    relatedInterventionId: "solar-canopies",
    caption:
      "A parking-area solar canopy combines shade, structure, and distributed electricity in one public object.",
    whyItBelongs:
      "It shows solar shade as infrastructure, not product imagery or lifestyle decoration.",
    presentation: "photograph"
  },
  {
    id: "wind-tower-qanat-cooling",
    title: "Wind-tower and qanat cooling diagram",
    source: "Wikimedia Commons",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Wind-Tower-and-Qanat-Cooling-1.svg/1024px-Wind-Tower-and-Qanat-Cooling-1.svg.png",
    credit: "Williamborg; derivative work: Monsih",
    license: "Public domain",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wind-Tower-and-Qanat-Cooling-1.svg",
    relatedInterventionId: "passive-cooling-retrofits",
    caption:
      "A wind-tower and qanat diagram documents a passive cooling logic built from air movement, water, and mass.",
    whyItBelongs:
      "It gives passive retrofits an engineering lineage instead of treating cooling as a new gadget category.",
    presentation: "diagram"
  },
  {
    id: "passive-daytime-radiative-cooling-diagram",
    title: "Passive daytime radiative cooling diagram",
    source: "Wikimedia Commons",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Passive_daytime_radiative_cooling_diagram.jpg/630px-Passive_daytime_radiative_cooling_diagram.jpg",
    credit: "NiAxolotl",
    license: "CC BY-SA 4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Passive_daytime_radiative_cooling_diagram.jpg",
    relatedInterventionId: "ultra-white-roof-coatings",
    caption:
      "The diagram explains how selective radiation to the sky can cool a surface under sunlight.",
    whyItBelongs:
      "It turns roof reflectance into a physical mechanism that can be read, tested, and debated.",
    presentation: "diagram"
  }
];

export const heroEditorialImage = editorialImages[0];

export function getEditorialImageForIntervention(interventionId: string) {
  return editorialImages.find(
    (image) => image.relatedInterventionId === interventionId
  );
}
