export type InterventionMaturity =
  | "known"
  | "deployable"
  | "emerging"
  | "experimental"
  | "speculative";

export type InterventionEvidence =
  | "very high"
  | "high"
  | "medium"
  | "early"
  | "speculative";

export type Intervention = {
  id: string;
  title: string;
  category: string;
  scale: string[];
  maturity: InterventionMaturity;
  mechanism: string;
  whatMakesItInteresting: string;
  localPrototype: string;
  whatToMeasure: string[];
  risks: string[];
  evidenceStrength: InterventionEvidence;
  status: string;
};

export type FieldPrototype = {
  id: string;
  title: string;
  whatToTest: string;
  whereToTryIt: string;
  whatToMeasure: string[];
  toolsNeeded: string[];
  evidenceValue: string;
  possibleRisk: string;
};

export type PossibleNotProven = {
  id: string;
  title: string;
  hypothesis: string;
  mechanism: string;
  whatWouldNeedToBeTrue: string;
  whatCouldGoWrong: string;
  smallestUsefulTest: string;
  evidenceThatWouldChangeOurMind: string;
};

export const interventions: Intervention[] = [
  {
    id: "ultra-white-roof-coatings",
    title: "Ultra-white roof coatings",
    category: "Materials / Buildings",
    scale: ["roof", "school", "warehouse", "city block"],
    maturity: "deployable",
    mechanism: "High solar reflectance reduces heat absorption at the surface.",
    whatMakesItInteresting:
      "A surface treatment can change building heat without adding complex machinery.",
    localPrototype:
      "Paint selected school roofs and compare indoor temperatures against similar untreated buildings.",
    whatToMeasure: ["roof surface temperature", "room temperature below", "cooling demand"],
    risks: ["glare", "durability", "embodied carbon", "maintenance", "winter tradeoffs"],
    evidenceStrength: "high",
    status: "ready for controlled pilots"
  },
  {
    id: "reflective-cooling-textiles",
    title: "Reflective cooling textiles",
    category: "Clothing / Body cooling",
    scale: ["individual", "workers", "uniforms", "public life"],
    maturity: "emerging",
    mechanism: "Reflects solar radiation and may improve thermal comfort outdoors.",
    whatMakesItInteresting:
      "What people wear can become part of adaptation, especially for exposed work.",
    localPrototype:
      "Compare outdoor worker comfort and skin or clothing temperature across textile types.",
    whatToMeasure: ["skin temperature", "garment temperature", "comfort score", "wash cycles"],
    risks: ["comfort", "washability", "cost", "style", "adoption"],
    evidenceStrength: "early",
    status: "promising, still contextual"
  },
  {
    id: "cool-pavements",
    title: "Cool pavements",
    category: "Urban surfaces",
    scale: ["street", "plaza", "schoolyard"],
    maturity: "experimental",
    mechanism:
      "Higher reflectance and evaporative properties can reduce surface heat.",
    whatMakesItInteresting:
      "Streets are huge heat-absorbing surfaces hiding in plain sight.",
    localPrototype:
      "Run a one-block pilot with surface temperature and pedestrian comfort measurements.",
    whatToMeasure: ["surface temperature", "mean radiant temperature", "glare", "wear"],
    risks: ["glare", "tire wear", "maintenance", "uncertain air-temperature effect"],
    evidenceStrength: "medium",
    status: "pilot with careful measurement"
  },
  {
    id: "shade-as-infrastructure",
    title: "Shade as infrastructure",
    category: "Public space / Architecture",
    scale: ["bus stops", "schools", "streets", "plazas"],
    maturity: "deployable",
    mechanism: "Blocks direct solar exposure and reduces heat stress.",
    whatMakesItInteresting:
      "Shade is simple, visible, and immediately felt by people using the city.",
    localPrototype:
      "Map unshaded hot zones and install temporary summer shade structures.",
    whatToMeasure: ["shade hours", "surface temperature", "thermal comfort", "use"],
    risks: ["wind", "safety", "fire rules", "maintenance", "public acceptance"],
    evidenceStrength: "very high",
    status: "deployable now"
  },
  {
    id: "passive-cooling-retrofits",
    title: "Passive cooling retrofits",
    category: "Buildings / Architecture",
    scale: ["home", "school", "office", "neighborhood"],
    maturity: "known",
    mechanism:
      "Insulation, ventilation, orientation, thermal mass, shutters, shade, and night cooling reduce heat gain.",
    whatMakesItInteresting:
      "Reduces cooling demand before adding more energy systems.",
    localPrototype:
      "Retrofit one school or municipal building and measure comfort and energy use.",
    whatToMeasure: ["indoor comfort", "peak temperature", "energy use", "occupant feedback"],
    risks: ["upfront cost", "regulation", "construction complexity"],
    evidenceStrength: "high",
    status: "known, under-deployed"
  },
  {
    id: "methane-leak-detection",
    title: "Methane leak detection",
    category: "Measurement / Emissions",
    scale: ["landfill", "gas network", "oil and gas", "agriculture"],
    maturity: "deployable",
    mechanism: "Finding and stopping methane leaks can reduce near-term warming.",
    whatMakesItInteresting:
      "Measurement can quickly become action when repair responsibility is visible.",
    localPrototype:
      "Survey waste sites or infrastructure and publish repair timelines.",
    whatToMeasure: ["detected plumes", "repair time", "estimated avoided methane"],
    risks: ["enforcement", "data access", "accountability"],
    evidenceStrength: "high",
    status: "high-impact detection layer"
  },
  {
    id: "solar-canopies",
    title: "Solar canopies",
    category: "Energy / Shade",
    scale: ["parking lots", "schools", "public squares", "transit"],
    maturity: "deployable",
    mechanism: "Produces clean electricity while creating shade.",
    whatMakesItInteresting:
      "One intervention can reduce fossil energy and heat exposure at the same time.",
    localPrototype:
      "Cover parking lots or schoolyards and measure shade, energy, and comfort.",
    whatToMeasure: ["electricity generated", "shade coverage", "surface temperature", "use"],
    risks: ["cost", "permitting", "grid connection", "maintenance"],
    evidenceStrength: "high",
    status: "deployable where economics work"
  },
  {
    id: "urban-shade-corridors",
    title: "Urban tree / shade corridors",
    category: "Nature / Urban cooling",
    scale: ["street", "district", "city"],
    maturity: "known",
    mechanism: "Shade and evapotranspiration reduce heat exposure.",
    whatMakesItInteresting:
      "Cooling, biodiversity, comfort, and public space can align.",
    localPrototype:
      "Create shaded walking routes between schools, transit, and care facilities.",
    whatToMeasure: ["canopy cover", "route temperature", "walkability", "water use"],
    risks: ["water demand", "maintenance", "species selection", "unequal deployment"],
    evidenceStrength: "high",
    status: "known, needs planning"
  },
  {
    id: "reflective-membranes",
    title: "Speculative reflective membranes",
    category: "Possible / Not proven",
    scale: ["street", "plaza", "building facade", "temporary summer installation"],
    maturity: "speculative",
    mechanism: "Shade and reflection could reduce direct solar heat gain.",
    whatMakesItInteresting:
      "A disciplined version of the cover-the-city-in-white-fabric pipe dream.",
    localPrototype:
      "Run a small temporary canopy test over a schoolyard or plaza during heat waves.",
    whatToMeasure: ["radiant temperature", "glare", "wind load", "public response"],
    risks: ["glare", "wind", "fire", "aesthetics", "embodied carbon", "actual cooling performance"],
    evidenceStrength: "speculative",
    status: "possible, not proven"
  }
];

export const fieldPrototypes: FieldPrototype[] = [
  {
    id: "one-white-roof",
    title: "Paint one roof white",
    whatToTest: "Whether a reflective coating changes the room below during hot days.",
    whereToTryIt: "A school, warehouse, or municipal building with a comparable untreated roof.",
    whatToMeasure: ["roof temperature", "indoor peak temperature", "cooling energy"],
    toolsNeeded: ["thermal camera", "indoor sensors", "energy meter", "weather log"],
    evidenceValue: "Shows a direct building-level cooling effect in local conditions.",
    possibleRisk: "Glare, coating durability, or a winter heating penalty."
  },
  {
    id: "three-textiles",
    title: "Compare three outdoor textiles",
    whatToTest: "How different fabrics affect comfort for people working or waiting outdoors.",
    whereToTryIt: "Public works teams, school uniforms, outdoor markets, or event staff.",
    whatToMeasure: ["skin temperature", "fabric temperature", "comfort score", "washability"],
    toolsNeeded: ["surface thermometer", "short survey", "sun exposure log"],
    evidenceValue: "Turns body cooling into something observable and selectable.",
    possibleRisk: "A cooler textile may fail on comfort, cost, identity, or care."
  },
  {
    id: "hottest-bus-stop",
    title: "Shade the hottest bus stop",
    whatToTest: "Whether temporary shade changes comfort and waiting behavior.",
    whereToTryIt: "A transit stop with high heat exposure and meaningful daily use.",
    whatToMeasure: ["shade hours", "surface temperature", "waiter count", "comfort score"],
    toolsNeeded: ["shade structure", "temperature logger", "count sheet", "permit check"],
    evidenceValue: "Makes heat adaptation visible at a human scale.",
    possibleRisk: "Wind, fire rules, maintenance, or obstruction of sight lines."
  },
  {
    id: "cooling-schoolyard",
    title: "Turn a schoolyard into a cooling test site",
    whatToTest: "How shade, surface color, water, and planting change a child-scale heat landscape.",
    whereToTryIt: "A paved schoolyard with limited shade and summer programming.",
    whatToMeasure: ["surface temperatures", "shade map", "use patterns", "teacher feedback"],
    toolsNeeded: ["temporary shade", "surface sensors", "simple map", "student observations"],
    evidenceValue: "Creates a public learning environment while reducing exposure.",
    possibleRisk: "Uneven access, maintenance burden, or changes that do not survive the season."
  },
  {
    id: "walking-route",
    title: "Map heat exposure on one walking route",
    whatToTest: "Where people experience the harshest heat between daily destinations.",
    whereToTryIt: "A route between schools, transit, care facilities, and shops.",
    whatToMeasure: ["shade continuity", "surface heat", "rest points", "perceived comfort"],
    toolsNeeded: ["phone map", "temperature sensor", "clipboards", "local volunteers"],
    evidenceValue: "Turns abstract heat into a route-level action plan.",
    possibleRisk: "Measurements can vary by time of day, wind, and surrounding surfaces."
  },
  {
    id: "solar-shade-lot",
    title: "Convert one parking lot into solar shade",
    whatToTest: "Whether a canopy can deliver electricity, cooler surfaces, and better public use.",
    whereToTryIt: "A school, sports facility, municipal lot, or transit parking area.",
    whatToMeasure: ["solar output", "surface temperature", "shade coverage", "maintenance needs"],
    toolsNeeded: ["site plan", "utility data", "thermal camera", "permitting review"],
    evidenceValue: "Combines mitigation and adaptation in a single visible asset.",
    possibleRisk: "High upfront cost, grid delays, or design that shades cars but not people."
  }
];

export const possibleNotProven: PossibleNotProven[] = [
  {
    id: "seasonal-reflective-canopies",
    title: "Seasonal reflective canopies",
    hypothesis:
      "Temporary reflective shade could cool selected public spaces during heat waves without permanent construction.",
    mechanism:
      "Block direct sun, reflect incoming radiation, and reduce mean radiant temperature below.",
    whatWouldNeedToBeTrue:
      "The structure must be safe, low-glare, reusable, low-carbon, and measurably cooler for people below it.",
    whatCouldGoWrong:
      "Wind, fire rules, aesthetics, glare, storage, and embodied carbon could erase the benefits.",
    smallestUsefulTest:
      "One small canopy over a schoolyard or plaza for two hot weeks, with matched measurements nearby.",
    evidenceThatWouldChangeOurMind:
      "No meaningful comfort improvement, high glare, safety problems, or poor public acceptance."
  },
  {
    id: "cooling-surface-library",
    title: "A city library of cooling surfaces",
    hypothesis:
      "Cities could maintain a tested catalogue of coatings, fabrics, pavers, membranes, and shade parts.",
    mechanism:
      "Procurement becomes faster when materials have shared measurements, known risks, and local evidence.",
    whatWouldNeedToBeTrue:
      "Tests must be comparable, public, independently measured, and useful to small local buyers.",
    whatCouldGoWrong:
      "Vendors could overclaim, pilots could become scattered, or evidence could fail to travel between climates.",
    smallestUsefulTest:
      "Publish ten local material tests with identical measurement templates and procurement notes.",
    evidenceThatWouldChangeOurMind:
      "No buyer uses the evidence, or results are too context-specific to guide decisions."
  },
  {
    id: "uniform-as-adaptation",
    title: "Uniforms as adaptation infrastructure",
    hypothesis:
      "Workwear, schoolwear, and public-service uniforms could become a measurable heat-reduction layer.",
    mechanism:
      "Reflective, breathable, and culturally acceptable textiles reduce body heat gain during exposure.",
    whatWouldNeedToBeTrue:
      "The garments must be cooler, durable, affordable, washable, desirable, and compatible with job requirements.",
    whatCouldGoWrong:
      "A technically cooler garment may fail socially, aesthetically, operationally, or economically.",
    smallestUsefulTest:
      "Compare three garment systems with one outdoor team across repeated summer shifts.",
    evidenceThatWouldChangeOurMind:
      "No comfort improvement, poor durability, low adoption, or higher heat burden in real use."
  }
];
