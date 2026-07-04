import type { EvidenceProfile, RoadmapLever, WatchlistSignal } from "./types";

export const roadmapLevers: RoadmapLever[] = [
  {
    id: "long-lived-ghgs",
    title: "Stop adding long-lived greenhouse gases",
    currentState:
      "The atmosphere is still accumulating carbon dioxide from fossil fuel use, land use change, and industrial processes.",
    whyItMatters:
      "Long-lived gases determine the warming that persists for decades to millennia.",
    whatNeedsToChange:
      "Net additions must fall to zero, with residual emissions balanced by durable removals and protected sinks.",
    speedRequired:
      "Global CO2 emissions must bend immediately and keep falling every decade.",
    evidenceStrength: "Very high",
    dataSources: ["NASA GISTEMP", "NOAA GML", "OWID", "IEA"],
    reviewDate: "Monthly for indicators; annually for system state."
  },
  {
    id: "methane-fast",
    title: "Cut methane fast",
    currentState:
      "Atmospheric methane remains high and continues to rise, with energy, agriculture, and waste all contributing.",
    whyItMatters:
      "Methane is shorter-lived than CO2 but far more powerful over the near term.",
    whatNeedsToChange:
      "Leak detection, fossil methane controls, waste capture, and agricultural methane reductions need rapid deployment.",
    speedRequired:
      "This decade matters most; reductions can slow near-term heating quickly.",
    evidenceStrength: "High",
    dataSources: ["NOAA GML", "IEA", "Copernicus"],
    reviewDate: "Monthly atmospheric review; annual sector review."
  },
  {
    id: "replace-fossil-energy",
    title: "Replace fossil energy",
    currentState:
      "Clean electricity is growing, but fossil fuels still supply most final energy and many industrial heat needs.",
    whyItMatters:
      "Energy combustion remains the largest source of human-caused CO2 emissions.",
    whatNeedsToChange:
      "Renewables, firm clean power, grids, storage, demand flexibility, and permitting must scale together.",
    speedRequired:
      "Deployment must compound year after year while fossil generation retires.",
    evidenceStrength: "High",
    dataSources: ["OWID", "IEA"],
    reviewDate: "Quarterly deployment review; annual emissions review."
  },
  {
    id: "electrify-demand",
    title: "Electrify transport and buildings",
    currentState:
      "Electric vehicles and heat pumps are scaling unevenly across regions, while oil and gas demand remain large.",
    whyItMatters:
      "Electrification allows clean power to displace combustion across daily life and freight.",
    whatNeedsToChange:
      "Vehicles, heating, cooking, charging, grid capacity, and affordability must move as one system.",
    speedRequired:
      "New sales must shift quickly enough to turn over long-lived equipment stocks.",
    evidenceStrength: "High",
    dataSources: ["IEA", "OWID"],
    reviewDate: "Quarterly market review."
  },
  {
    id: "industrial-emissions",
    title: "Reduce industrial emissions",
    currentState:
      "Steel, cement, chemicals, and high-temperature heat remain harder to decarbonize than power or vehicles.",
    whyItMatters:
      "Industrial assets are long-lived, capital intensive, and essential to development.",
    whatNeedsToChange:
      "Efficiency, clean heat, low-carbon materials, carbon capture where appropriate, and circular material use must mature.",
    speedRequired:
      "Demonstrations must become commercial systems before the next major asset replacement cycle.",
    evidenceStrength: "Medium",
    dataSources: ["IEA", "OWID"],
    reviewDate: "Semiannual technology review."
  },
  {
    id: "carbon-sinks",
    title: "Protect and restore carbon sinks",
    currentState:
      "Forests, soils, wetlands, and oceans absorb part of human emissions, but some sinks are under stress.",
    whyItMatters:
      "A weaker sink means more emitted carbon remains in the atmosphere.",
    whatNeedsToChange:
      "Deforestation must fall, degraded ecosystems must recover, and carbon storage claims must be measured carefully.",
    speedRequired:
      "Protection is urgent; restoration accumulates benefits over decades.",
    evidenceStrength: "High",
    dataSources: ["Copernicus", "NASA", "NOAA"],
    reviewDate: "Quarterly signal review."
  },
  {
    id: "cool-surfaces",
    title: "Cool cities and surfaces",
    currentState:
      "Urban heat exposure is rising as cities grow, heatwaves intensify, and surfaces retain heat.",
    whyItMatters:
      "Local cooling reduces health risk and energy demand while global emissions fall.",
    whatNeedsToChange:
      "Shade, reflective surfaces, vegetation, water-sensitive design, and building standards must become routine infrastructure.",
    speedRequired:
      "Fast local action can reduce harm before global temperature stabilizes.",
    evidenceStrength: "Medium",
    dataSources: ["Copernicus", "NASA"],
    reviewDate: "Seasonal review."
  },
  {
    id: "adaptation",
    title: "Improve climate adaptation",
    currentState:
      "Adaptation is expanding, but risk reduction remains slower than hazard growth in many places.",
    whyItMatters:
      "Even successful mitigation leaves societies managing heat, flood, drought, fire, and food-system risk.",
    whatNeedsToChange:
      "Forecasting, infrastructure, public health, insurance, finance, and local capacity must become more anticipatory.",
    speedRequired:
      "Every extreme season should update planning, standards, and investment.",
    evidenceStrength: "High",
    dataSources: ["Copernicus", "NASA", "NOAA"],
    reviewDate: "Seasonal review."
  },
  {
    id: "learning-policy-finance",
    title: "Accelerate learning, policy, finance, and deployment",
    currentState:
      "The constraint is no longer only invention; it is coordination, trust, investment, and institutional speed.",
    whyItMatters:
      "Climate progress depends on systems learning faster than warming accumulates.",
    whatNeedsToChange:
      "Policy, finance, procurement, permitting, public learning, and measurement must reinforce one another.",
    speedRequired:
      "Feedback loops should shorten from decades to months wherever evidence allows.",
    evidenceStrength: "Medium",
    dataSources: ["IEA", "OWID", "Peer-reviewed literature"],
    reviewDate: "Quarterly review."
  }
];

export const evidenceProfiles: EvidenceProfile[] = [
  {
    id: "warming-human-caused",
    claim:
      "The recent rise in global temperature is primarily caused by human-added greenhouse gases.",
    whatWeKnow:
      "Observed warming, atmospheric greenhouse gas growth, radiative physics, and attribution studies point in the same direction.",
    whatWeBelieve:
      "The dominant lever for stopping additional long-term heating is ending net additions of long-lived greenhouse gases.",
    whatWeSuspect:
      "Regional damages and feedbacks may intensify unevenly as warming continues.",
    whatRemainsUnknown:
      "The exact timing and size of some feedbacks, regional tipping risks, and social responses remain uncertain.",
    strengthOfEvidence: "Very high",
    scientificConsensus: "Very strong across climate physics, observations, and attribution research.",
    researchMaturity: "Mature.",
    knownDisagreements:
      "Disagreements focus more on sensitivity ranges, damages, policy choices, and timelines than on the core cause.",
    reviewSchedule: "Review annually, or sooner after major assessment updates.",
    relatedInterventionIds: [
      "methane-leak-detection",
      "solar-canopies",
      "passive-cooling-retrofits"
    ]
  },
  {
    id: "methane-near-term",
    claim:
      "Cutting methane can reduce the rate of near-term warming while CO2 reductions determine long-term stabilization.",
    whatWeKnow:
      "Methane has a shorter atmospheric lifetime than CO2 and a strong warming effect over the next few decades.",
    whatWeBelieve:
      "Rapid methane cuts are among the fastest available ways to slow additional heating.",
    whatWeSuspect:
      "Some methane sources can be reduced more cheaply than current policy and market behavior suggest.",
    whatRemainsUnknown:
      "Precise source attribution, wetland feedbacks, and regional emissions estimates remain challenging.",
    strengthOfEvidence: "High",
    scientificConsensus: "Strong on physics and broad mitigation value.",
    researchMaturity: "Mature physics; improving measurement and attribution.",
    knownDisagreements:
      "Debate remains around accounting metrics, sector responsibility, and the feasibility of specific reductions.",
    reviewSchedule: "Review quarterly with atmospheric data and annually with sector data.",
    relatedInterventionIds: [
      "methane-leak-detection",
      "solar-canopies",
      "passive-cooling-retrofits"
    ]
  },
  {
    id: "clean-energy-scale",
    claim:
      "Replacing fossil energy requires simultaneous progress in clean power, electrification, grids, storage, and demand flexibility.",
    whatWeKnow:
      "Clean electricity is expanding, but energy demand, infrastructure constraints, and fossil lock-in shape the speed of transition.",
    whatWeBelieve:
      "Deployment capacity and institutions are now as important as technology availability.",
    whatWeSuspect:
      "Learning curves and policy coordination can keep accelerating deployment if supply chains and permitting keep pace.",
    whatRemainsUnknown:
      "The future mix of firm clean power, long-duration storage, hydrogen, and carbon capture varies by region and sector.",
    strengthOfEvidence: "High",
    scientificConsensus: "Strong on direction; more varied on exact technology portfolios.",
    researchMaturity: "Mature for power-sector direction; evolving for harder sectors.",
    knownDisagreements:
      "Researchers and institutions differ on nuclear, carbon capture, hydrogen, biomass, and grid buildout assumptions.",
    reviewSchedule: "Review quarterly for deployment signals and annually for system pathways.",
    relatedInterventionIds: [
      "solar-canopies",
      "passive-cooling-retrofits",
      "ultra-white-roof-coatings"
    ]
  },
  {
    id: "adaptation-needed",
    claim:
      "Adaptation is necessary even if mitigation succeeds, because some warming and impact risk are already locked in.",
    whatWeKnow:
      "Heat, flood, drought, wildfire, sea level, and food-system risks are already changing in measurable ways.",
    whatWeBelieve:
      "Adaptation should be treated as ongoing infrastructure and public-health work, not as emergency response alone.",
    whatWeSuspect:
      "The biggest adaptation failures may come from governance, inequality, and underinvestment rather than missing technical knowledge.",
    whatRemainsUnknown:
      "Local thresholds, compound risks, and future migration and insurance dynamics remain difficult to project.",
    strengthOfEvidence: "High",
    scientificConsensus: "Strong that adaptation and mitigation are complements, not substitutes.",
    researchMaturity: "Mature risk evidence; evolving implementation evidence.",
    knownDisagreements:
      "Debate remains over limits to adaptation, financing responsibility, and which metrics best capture resilience.",
    reviewSchedule: "Review seasonally after major events and annually for planning standards.",
    relatedInterventionIds: [
      "shade-as-infrastructure",
      "cool-pavements",
      "reflective-cooling-textiles",
      "urban-shade-corridors"
    ]
  }
];

export const watchlistSignals: WatchlistSignal[] = [
  {
    id: "temperature-step",
    label: "Temperature anomaly step-changes",
    whyNow:
      "Abrupt movement in recent anomalies can indicate ocean-atmosphere conditions that deserve closer explanation.",
    linkedIndicatorIds: ["global-temperature"],
    reviewCadence: "Monthly"
  },
  {
    id: "ghg-trend",
    label: "Greenhouse gas accumulation",
    whyNow:
      "CO2 and methane trends reveal whether the atmosphere is still moving away from stabilization.",
    linkedIndicatorIds: ["atmospheric-co2", "atmospheric-methane"],
    reviewCadence: "Monthly"
  },
  {
    id: "emissions-direction",
    label: "Energy-related emissions direction",
    whyNow:
      "Annual emissions direction shows whether structural change is overtaking demand growth.",
    linkedIndicatorIds: ["energy-co2-emissions"],
    reviewCadence: "Annual with interim context"
  },
  {
    id: "renewable-curve",
    label: "Renewable deployment curve",
    whyNow:
      "Clean energy growth has to keep compounding, not merely improve in isolated years.",
    linkedIndicatorIds: ["renewable-energy"],
    reviewCadence: "Annual with quarterly context"
  }
];
